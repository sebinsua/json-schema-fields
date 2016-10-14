import {
  renderDecimalWithUnit,
  renderSelector
} from './fields'

const uiSchema = {
  properties: {},
  types: {
    enum: {
      render: renderSelector
    },
    number: {
      render: renderDecimalWithUnit
    }
  }
}

export default uiSchema
