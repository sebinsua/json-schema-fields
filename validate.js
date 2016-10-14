import getIn from 'lodash/get'
import setIn from 'lodash/set'
import * as messages from '../../../../i18n'

export default function validate (values, props) {
  const { intl: { formatMessage } } = props
  const required = formatMessage(messages.validations.required)
  // const notANumber = formatMessage(messages.validations.notANumber)

  const errors = {}

  const average_price = getIn(values, 'average_price')
  if (!average_price) {
    setIn(errors, 'average_price', required)
  }

  return errors
}
