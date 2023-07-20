import './App.css'
import { ChangeEventHandler, HTMLInputTypeAttribute, useReducer } from 'react'
import { SelectField } from './components/StateSelectField'
import { useStateData } from './hooks/useStateData';
import { useCityData } from './hooks/useCityData';
import { validateEmail } from './util';

const formStateKeys = ['firstName', 'lastName', 'state', 'city', 'email', 'password'] as const;
type FormStateKey = typeof formStateKeys[number];
type FormState = Record<FormStateKey, { value: string, isValid: boolean | undefined }>

// Initialize isValid as true to prevent showing form errors on app load
const initalFormValues: Record<FormStateKey, { value: string, isValid: boolean | undefined }> = {
  firstName: { value: '', isValid: undefined },
  lastName: { value: '', isValid: undefined },
  state: { value: '', isValid: undefined },
  city: { value: '', isValid: undefined },
  email: { value: '', isValid: undefined },
  password: { value: '', isValid: undefined }
}

type FormAction = {
  fieldName: string,
  payload: { value: string | undefined, isValid: boolean | undefined }
}

const formReducer = (state: FormState, action: FormAction) => {
  return {
    ...state,
    [action.fieldName]: action.payload
  }
}

type FormDispatch = (value: string) => FormAction
const formActions: Record<FormStateKey, FormDispatch> = {
  firstName: value => ({ fieldName: "firstName", payload: { value, isValid: !!value && value.length > 0 } }),
  lastName: value => ({ fieldName: "lastName", payload: { value: value, isValid: !!value && value.length > 0 } }),
  state: value => ({ fieldName: "state", payload: { value: value, isValid: true } }),
  city: value => ({ fieldName: 'city', payload: { value: value, isValid: true } }),
  email: value => ({ fieldName: 'email', payload: { value: value, isValid: validateEmail(value) } }),
  password: value => ({ fieldName: 'password', payload: { value: value, isValid: !!value } })
}

const FormInputField: React.FC<{
  label: string,
  value: string,
  type?: HTMLInputTypeAttribute,
  formKey: FormStateKey,
  isValid?: boolean,
  invalidText?: string,
  onChange?: ChangeEventHandler<HTMLInputElement>
}> = ({ label, type = "text", formKey, isValid, invalidText, value, onChange }) => {
  return (
    <div className="input-field-container">
      <label htmlFor={formKey}>{label}</label>
      <input required name={formKey} id={formKey} type={type} value={value} onChange={onChange} />
      {isValid !== undefined && isValid === false && <span className="invalid-field">{invalidText}</span>}
    </div>
  )
}

function App() {
  const [formState, dispatch] = useReducer(formReducer, initalFormValues)
  const formIsInvalid = Object.values(formState).some(formValue => formValue.isValid !== undefined && formValue.isValid === false)

  const { stateValues, loading: statesLoading } = useStateData()
  const { cityValues, loading: citiesLoading } = useCityData(formState.state.value || stateValues[0]?.state_name)
  
  const isLoading = statesLoading || citiesLoading

  return (
    <div className="form-container">
      <h1>SIGN UP</h1>
      <form className="card">
        <FormInputField label='First Name' value={formState.firstName.value} formKey='firstName' isValid={formState.firstName.isValid} invalidText='Required' onChange={e => dispatch(formActions['firstName'](e.target.value))} />
        <FormInputField label='Last Name' value={formState.lastName.value} formKey='lastName' isValid={formState.lastName.isValid} invalidText='Required' onChange={e => dispatch(formActions['lastName'](e.target.value))} />
        <SelectField loading={statesLoading} formKey='state' label='State' onChange={selectedState => dispatch(formActions['state'](selectedState))} values={stateValues.map(item => ({ value: item.state_name }))} />
        <SelectField loading={citiesLoading} formKey='city' label='City' onChange={selectedState => dispatch(formActions['city'](selectedState))} values={cityValues.map(item => ({ value: item.city_name }))} />
        <FormInputField type='email' label='Email' value={formState.email.value} formKey='email' isValid={formState.email.isValid} invalidText='Must provide valid email address' onChange={e => dispatch(formActions['email'](e.target.value))} />
        <FormInputField type='password' label='Password' value={formState.password.value} formKey='password' isValid={formState.password.isValid} invalidText='Required' onChange={e => dispatch(formActions['password'](e.target.value))} />

        <button type='button' disabled={formIsInvalid || isLoading} onClick={() => {
          // Perform manual validation since we are using type='button' 
          // instead of type='submit' to prevent a redirect/refresh on submission.
          // While we are validating on input change, we still want a fall back validation 
          // here incase user tries to submit without entering any data.
          const invalidFields = formStateKeys.map(k => {
            if (formState[k].isValid === undefined) {
              dispatch(formActions[k](formState[k].value))
              return k
            }
          }).filter(v => !!v)

          const doSubmit = async () => {
            try {
              const jsonBody = formStateKeys.reduce((obj, key) => ({ ...obj, [key]: formState[key].value }), {})

              // Not actually making an API call, so just log this for now...
              // await fetch('BACK_END_URL', {method: 'POST', body: JSON.stringify(jsonBody)})
              console.log(JSON.stringify(jsonBody))

            } catch (e) {
              console.error("Error submitting form...")
              throw e
            }
          }
          if (invalidFields.length === 0) {
            doSubmit()
          }
        }}>Submit</button>
      </form>
    </div>
  )
}

export default App
