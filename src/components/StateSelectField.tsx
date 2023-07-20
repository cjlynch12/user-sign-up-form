import React from 'react'

type SelectFieldProps = {
    formKey: string
    label: string
    loading: boolean
    values: Array<{ value: string }>,
    onChange: (selectedValue: string) => void
}

export const SelectField: React.FC<SelectFieldProps> = ({ formKey, label, loading, values, onChange }) => {
    return (
        <div className='input-field-container'>
            <label htmlFor={formKey}>{label}</label>
            {loading ?
                <span>Loading...</span>
                :
                <select name={formKey} id={formKey} onChange={e => onChange(e.target.value)}>
                    {values.length > 0 ? values.map((item, idx) => (<option key={`${formKey}-option-${idx}`} value={item.value}>{item.value}</option>)) : <option>N/A</option>}
                </select>
            }
        </div>
    )
}