// @flow
import type {Dispatch} from 'redux'
import {BigNumber} from 'bignumber.js'

import walletManager from '../crypto/walletManager'
import {Logger} from '../utils/logging'

import type {State} from '../state'
import type {RemoteAccountState} from '../api/types'

// start fetching account balance
const _startFetching = () => ({
  type: 'START_FETCHING_ACCOUNT_STATE',
  path: ['accountState', 'isFetching'],
  payload: null,
  reducer: (state, isFetching) => true,
})

const _endFetching = () => ({
  type: 'END_FETCHING_ACCOUNT_STATE',
  path: ['accountState', 'isFetching'],
  payload: null,
  reducer: (state, isFetching) => false,
})

const _setAccountValue = (value) => ({
  type: 'SET_ACCOUNT_VALUE',
  path: ['accountState', 'value'],
  payload: value,
  reducer: (state, value) => value,
})

const _setAccountPool = (poolOperator) => ({
  type: 'SET_ACCOUNT_POOLS',
  path: ['accountState', 'poolOperator'],
  payload: poolOperator,
  reducer: (state, poolOperator) => poolOperator,
})

const _setAccountTotalDelegated = (value) => ({
  type: 'SET_ACCOUNT_TOTAL_DELEGATED',
  path: ['accountState', 'totalDelegated'],
  payload: value,
  reducer: (state, value) => value,
})

const _clearAccountState = () => ({
  type: 'CLEAR_ACCOUNT_STATE',
  path: ['accountState'],
  payload: null,
  reducer: (state) => {
    return {
      isFetching: false,
      lastFetchingError: null,
      totalDelegated: new BigNumber(0),
      value: new BigNumber(0),
      poolOperator: null,
    }
  },
})

const _setLastError = (error) => ({
  type: 'SET_LAST_FETCHING_ERROR',
  path: ['accountState', 'lastFetchingError'],
  payload: error,
  reducer: (state, error) => error,
})

export const fetchAccountState = () => async (
  dispatch: Dispatch<any>,
  getState: () => State,
) => {
  if (getState().accountState.isFetching) {
    return
  }
  dispatch(_clearAccountState())
  dispatch(_startFetching())
  try {
    const accountStateResp = await walletManager.fetchAccountState()
    const accountState: RemoteAccountState = Object.keys(accountStateResp).map(
      (key) => accountStateResp[key],
    )[0]
    const value = accountState.remainingAmount
    const poolOperator = accountState.poolOperator // note: currently returns null
    const utxos = getState().balance.utxos
    if (utxos != null) {
      const utxosForKey = await walletManager.getAllUtxosForKey(utxos)
      // prettier-ignore
      const amountToDelegate =
        utxosForKey != null
          ? utxosForKey
            .map((utxo) => utxo.amount)
            .reduce(
              (x: BigNumber, y) => x.plus(new BigNumber(y || 0)),
              new BigNumber(0),
            )
          : BigNumber(0)
      dispatch(
        _setAccountTotalDelegated(amountToDelegate.plus(new BigNumber(value))),
      )
    }
    dispatch(_setAccountValue(new BigNumber(value)))
    dispatch(_setAccountPool(poolOperator))
    dispatch(_setLastError(null))
  } catch (err) {
    Logger.debug(err)
    dispatch(_setLastError(err))
  } finally {
    dispatch(_endFetching())
  }
}
