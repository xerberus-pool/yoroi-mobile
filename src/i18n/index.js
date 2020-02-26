// @flow

import moment from 'moment'
import BigNumber from 'bignumber.js'

import 'moment/locale/ko'
import 'moment/locale/ja'
import 'moment/locale/zh-cn'
import 'moment/locale/ru'
import 'moment/locale/es'

import assert from '../utils/assert'
import {LANGUAGES} from './languages'

// note(v-almonacid): there is no distinction between trad vs simplified
// chinese locales in momentjs
const momentLocales = {
  [LANGUAGES.ENGLISH]: 'en',
  [LANGUAGES.CHINESE_SIMPLIFIED]: 'zh-cn',
  // TODO: Add when chinese traditional is available
  // [LANGUAGES.CHINESE_TRADITIONAL]: 'zh-cn',
  [LANGUAGES.KOREAN]: 'ko',
  [LANGUAGES.JAPANESE]: 'ja',
  [LANGUAGES.RUSSIAN]: 'ru',
  [LANGUAGES.SPANISH]: 'es',
}

// Add default custom formatting functions
Object.values(momentLocales).forEach((name) => {
  moment.updateLocale(name, {
    format: {
      dateToSeconds: 'Do MMM YYYY HH:mm:ss',
      timeToSeconds: 'LTS',
    },
  })
})

moment.updateLocale('en', {
  calendar: {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    nextDay: '[Tomorrow]',
    lastWeek: 'L',
    nextWeek: 'L',
    sameElse: 'L',
  },
})

const defaultNumberFmt = {
  prefix: '',
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSize: 0,
  fractionGroupSeparator: ' ',
  suffix: '',
}

// Note(ppershing): this is just temporary
// and should be replaced with real configs
const russianNumberFmt = {
  ...defaultNumberFmt,
  decimalSeparator: ',',
  groupSeparator: ' ',
}
const spanishNumberFmt = {
  ...defaultNumberFmt,
  decimalSeparator: ',',
  groupSeparator: '.',
}

const numberLocales = {
  [LANGUAGES.ENGLISH]: defaultNumberFmt,
  [LANGUAGES.CHINESE_SIMPLIFIED]: defaultNumberFmt,
  // TODO: Add when chinese traditional is available
  // [LANGUAGES.CHINESE_TRADITIONAL]: customNumberFmt,
  [LANGUAGES.KOREAN]: defaultNumberFmt,
  [LANGUAGES.JAPANESE]: defaultNumberFmt,
  [LANGUAGES.RUSSIAN]: russianNumberFmt,
  [LANGUAGES.SPANISH]: spanishNumberFmt,
}

export const setLanguage = (code: string) => {
  assert.assert(
    Object.values(LANGUAGES).includes(code),
    'Unknown language',
    code,
  )
  moment.locale(momentLocales[code])
  // $FlowFixMe
  BigNumber.config({
    FORMAT: numberLocales[code],
  })
}

setLanguage(LANGUAGES.ENGLISH)
