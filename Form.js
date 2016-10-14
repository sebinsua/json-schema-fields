import React from 'react'

import schemaReduxForm, { JsonSchemaFields, createFormatter } from '.'
import uiSchema from './uiSchema'

export function createLabelFormatter (formatter = createFormatter()) {
  return function labelFomatter (name, fieldProps = {}) {
    const { measureUnit } = fieldProps[name] || {}
    const label = [ formatter(name), measureUnit ? `(${measureUnit})` : null ].filter(s => s).join(' ')
    return label
  }
}

// TODO: Get this part finished first!!!
//
// Form is surrounded by a schemaReduxForm.
// Normal redux-form is assumed by the component.
// However this is not what is used.
// It is wrapped - ignore this for now.
// The wrapper uses redux-form.
// Within the form below it will use JsonSchemaFields and pass in some properties.
// Potentially these properties should actually be set within the context.

// TODO: JsonSchemaFields should not used schemaToFieldProps(schema, uiConfiguration, jsonSchemaConfiguration)
//       internally. It should pass in the result of this as `fields`.
// TODO: So should it exist?

function Form ({ fields }) {
  return (
    <div>
      <JsonSchemaFields fields={fields} />
    </div>
  )
}

const FORM_NAME = 'energy'
// What we do know:
// We know the FORM_NAME.
// we know that it will contain a submit handler, and what this is.
// We know the fields themselves and the validator will be defined by the schema.
// We know that the schema will not exist to begin with.
// We know that there may be some other fields defined. For example, id.

export default schemaReduxForm({ form: FORM_NAME, uiSchema })(Form)
