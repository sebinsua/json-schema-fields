import React, { PropTypes } from 'react'

import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

import errorText from 'shared/helpers/errorText'

export function renderDecimalWithUnit ({
  input: {
    className,
    label,
    measureUnit,
    ...remainingInputProps
  },
  ...fieldProps
}) {
  const labelText = [ label, measureUnit ? `(${measureUnit})` : null ].filter(s => s).join(' ')
  return (
    <div className={className}>
      <TextField
        {...remainingInputProps}
        floatingLabelText={labelText}
        errorText={errorText(fieldProps)}
        type="number"
        min={0}
        step={0.01}
        fullWidth
      />
    </div>
  )
}

renderDecimalWithUnit.propTypes = {
  input: PropTypes.object.isRequired
}

export function renderSelector ({
  input: {
    className,
    label,
    options = [],
    onChange,
    ...remainingInputProps
  },
  ...fieldProps
}) {
  return (
    <div className={className}>
      <SelectField
        {...remainingInputProps}
        floatingLabelText={label}
        errorText={errorText(fieldProps)}
        onChange={(event, index, value) => onChange(value)}
        fullWidth
      >
        {options.map(({ name, value }, key) =>
          <MenuItem key={key} value={value} primaryText={name} />
        )}
      </SelectField>
    </div>
  )
}

renderSelector.propTypes = {
  input: PropTypes.object.isRequired
}
