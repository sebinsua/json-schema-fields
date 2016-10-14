import { Field } from 'redux-form'
import ExtendableError from 'extendable-error-class'
import renderComponent from 'recompose/renderComponent'
import merge from 'lodash/merge'
import pick from 'lodash/fp/pick'

const JSON_SCHEMA_DRAFT_04 = 'http://json-schema.org/draft-04/schema'

class UnsupportedSchemaError extends ExtendableError {

  constructor(message) {
    super(message)
    this.type = 'schema'
  }

}

class UnsupportedSchemaTypeError extends ExtendableError {

  constructor(message) {
    super(message)
    this.type = 'schema'
  }

}

const INPUT_FIELD_PROPS = [ 'readOnly', 'disabled', 'required' ]

const toExtraProps = pick([ ...INPUT_FIELD_PROPS ])

export function createFormatter (messages = {}, formatMessage) {
  return function formatter (name) {
    if (!messages[name]) {
      return name
    } else {
      return formatMessage ? formatMessage(messages[name]): messages[name]
    }
  }
}

const DEFAULT_FORMATTER = createFormatter()

const TYPE_NUMBER = 'number'
const TYPE_ENUM = 'enum'

const DEFAULT_SCHEMA = { properties: {}, required: [] }
const DEFAULT_UI_CONFIGURATION = {
  properties: {},
  types: {
    [TYPE_NUMBER]: {
      transformPropsForRender({ fieldName, fieldProps }, { render }, { fieldClassName, formatMessage }) {
        return ({
          className: fieldClassName,
          label: formatMessage(fieldName),
          name: fieldName,
          component: render
        })
      }
    },
    [TYPE_ENUM]: {
      transformPropsForRender({ fieldName, fieldProps, enumOptions }, { render }, { fieldClassName, formatMessage }) {
        return {
          className: fieldClassName,
          label: formatMessage(fieldName, fieldProps),
          name: fieldName,
          options: enumOptions.map(option => ({ value: option, name: formatMessage(option) })),
          component: render
        }
      }
    }
  }
}

function createFieldProps (properties, uiConfiguration, { fieldClassName, formatMessage = DEFAULT_FORMATTER }) {
  return function createFieldPropsWithFieldName (fieldName) {
    const fieldDefinition = properties[fieldName]
    const fieldProps = uiConfiguration.properties[fieldName] || {}
    if (fieldDefinition) {
      const type = fieldDefinition.type
      const uiConfigurationOfType = uiConfiguration.types[type] || {}
      const { transformPropsForRender } = uiConfigurationOfType

      const isTypeObject = type !== null && typeof type === 'object'
      if (isTypeObject) {
        const isEnum = TYPE_ENUM in type
        if (isEnum) {
          const enumOptions = type[TYPE_ENUM]
          return {
            ...transformPropsForRender({ fieldName, fieldProps, enumOptions }, uiConfigurationOfType, { fieldClassName, formatMessage }),
            ...toExtraProps(fieldProps)
          }
        } else {
          throw new UnsupportedSchemaTypeError(
            `fieldName (${fieldName}) has a type (${type}) which is not supported.`
          )
        }
      } else {
        switch (type) {
          case TYPE_NUMBER:
            return {
              ...transformPropsForRender({ fieldName, fieldProps }, uiConfigurationOfType, { fieldClassName, formatMessage }),
              ...toExtraProps(fieldProps)
            }
          default:
            throw new UnsupportedSchemaTypeError(
              `fieldName (${fieldName}) has a type (${type}) which is not supported.`
            )
        }
      }
    } else {
      throw new Error(`fieldName (${fieldName}) is missing from schema.properties.`)
    }
  }
}

function markConfigurationWithRequiredProperties (uiConfiguration, requiredProperties = []) {
  for (const propertyName in uiConfiguration.properties) {
    if (requiredProperties.includes(propertyName)) {
      uiConfiguration.properties[propertyName].required = true
    }
  }
  return uiConfiguration
}

function schemaToFieldProps (
  schema = DEFAULT_SCHEMA,
  uiConfiguration = DEFAULT_UI_CONFIGURATION,
  jsonSchemaConfiguration = {}
) {
  const { properties = {}, required = [] } = schema
  const fieldNames = Object.keys(schema.properties)
  return fieldNames.map(
    createFieldProps(
      properties,
      merge({}, DEFAULT_UI_CONFIGURATION, markConfigurationWithRequiredProperties(uiConfiguration, required)),
      jsonSchemaConfiguration
    )
  )
}

export function JsonSchemaFields ({
  schema,
  uiConfiguration,
  ...jsonSchemaConfiguration
}) {
  return schemaToFieldProps(schema, uiConfiguration, jsonSchemaConfiguration).map(renderComponent(Field))
}

import getIn from 'lodash/get'
import setIn from 'lodash/set'

// TODO:
// Passed in:
// - a schema
// - a jsonSchemaConfiguration ({ formatMessage = DEFAULT_FORMATTER })
// To validate:
//   schema.required is used
//   schema.properties[fieldName].type === number or enum (with its values checked)
// To format:
//   the formatMessage passed in should be created from validationMessages.
function createValidatorWithSchema (schema, { formatMessage = DEFAULT_FORMATTER }) {
  return function validator (values) {
    const errors = {}

    const fieldName = 'example'
    const value = getIn(values, fieldName)
    if (!value) {
      setIn(errors, fieldName, formatMessage('required'))
    }
    if (typeof value !== 'number') { // TODO: Test if stringy number?
      setIn(errors, fieldName, formatMessage('notANumber'))
    }
    // TODO: Test if enum type.

    return errors
  }
}

// TODO: This should be worked on depending on ElectricityBenchmarkForm.
//
// 1. We must use an action to fetch a schema.
// 2. We must grab the schema from a store.
// 3. While waiting for this to happen we should show a loading indicator.
// 4. On receving the schema we must create fields and setup validators.
//
// Consider the usage of $ref to point to a schema on fetch.
export function schemaReduxForm (options) {
  return function SchemaReduxForm () {
    // TODO: When a schema is received, this should wrap a redux-form hoc with the extra shit.
    const schema = {}
    if (schema.type !== 'object' || schema['$schema'] !== JSON_SCHEMA_DRAFT_04) {
      throw new UnsupportedSchemaError(`Schema should be an object and follow ${JSON_SCHEMA_DRAFT_04}`)
    }
  }

}

// NOTE: It should be possible to have nested Field items in a redux-form.
//       Due to: https://github.com/erikras/redux-form/blob/master/src/Field.js#L102-L104

// TODO:
// Where is Field used?
// Where is reduxForm used?
// Can they both be avoided or injected?

export default schemaReduxForm
