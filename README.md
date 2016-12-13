# `json-schema-fields`

- [x] Wrote preliminary JSON Schema Fields code.
- [ ] Code has never been tested, and is only 50% complete.

**What I need to do**

- [ ] `FieldsList` should accept a `fields` and render them.
- [ ]  `schemaReduxForm` will:
      - [ ] Represent a very similar interface to `redux-form#reduxForm`. But:
          - [ ] Be able to accept an `options` containing a `schema`.
          - [ ] Be able to accept an `options` containing an `action` that could cause a `schema` to be fetched. Perhaps name this `getSchema`; it should either come from `props` or from `options`. It will have the `FORM_NAME` bound within it, and should also come with a reducer to ensure that schemas are placed against the correct form.
      - [ ] Use its `schema` to create some `fields` via the `schemaToFieldProps` function (potentially rename this to be consistent with the create validate function).
      - [ ] Use its `schema` to create a `validate` function via the `createValidatorWithSchema`.
      - [ ] The `schema` that can be received from `props` should come from the `store.forms[FORM_NAME].schema`, using something very like [`formValueSelector`](http://redux-form.com/6.0.5/docs/api/FormValueSelector.md/).
- [ ] Make it not depend upon `Field` or `redux-form` if at all possible. Magic.
- [ ] Write a working `createValidatorWithSchema` function.
- [ ] Unit test individual functions.

Must support this:

```json
{
  "type": "object",
  "$schema": "http://json-schema.org/draft-04/schema",
  "properties": {
    "market_type": { "type": { "enum": ["free", "regulated"]}},
    "average_price": { "type": "number" },
    "average_one_day": { "type": "number" },
    "purchase_amount": { "type": "number" }
  },
  "required": [
    "market_type", "average_price", "average_one_day", "purchase_amount"
  ]
}
```
