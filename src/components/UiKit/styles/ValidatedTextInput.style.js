// @flow
import {StyleSheet} from 'react-native'

export default StyleSheet.create({
  container: {
    paddingTop: 16,
    marginBottom: 8,
  },
  input: {
    borderColor: '#4A4A4A',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    height: 48,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#FF1351',
  },
  labelWrap: {
    backgroundColor: '#fff',
    marginLeft: 12,
    top: 8,
    paddingHorizontal: 4,
    position: 'absolute',
  },
  label: {
    color: '#4A4A4A',
  },
  labelError: {
    color: '#FF1351',
  },
  error: {
    color: '#FF1351',
    paddingHorizontal: 16,
    lineHeight: 24,
  },
})
