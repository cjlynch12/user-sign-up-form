import { useEffect, useState } from "react"
import { useAccessTokens } from "../hooks/useAccessTokens"


// ensure response is valid, non-empty, and contains proper keys
const isCitiesResponse = (body: any): body is Array<{ city_name: string }> => {
    return !!body && Array.isArray(body) && body.length > 0 && Object.keys(body[0]).includes('city_name')
}
export const CitySelectField: React.FC<{ stateName: string, onCityChange: (selectedCity: string) => void }> = ({ stateName, onCityChange }) => {
    const [cityValues, setCityValues] = useState<Array<{ city_name: string }>>([])

    const { token } = useAccessTokens('universal-tutorial')
    const fetchCities = async (stateName: string) => {
        try {
            if (token && stateName) {
                const request = await fetch(`https://www.universal-tutorial.com/api/cities/${stateName}`, { method: 'GET', headers: { "Accept": "application/json", 'Authorization': `Bearer ${token}` } })
                const body = await request.json()
                if (isCitiesResponse(body)) {

                    return body
                } else {
                    return []
                }
            }
        } catch (e) {
            console.error('Could not fetch cities...')
            throw e
        }
    }

    useEffect(() => {
        const doFetchCities = async () => {
            const result = await fetchCities(stateName)
            if (result) {
                setCityValues(result)
                onCityChange(result[0].city_name)
            }
        }

        doFetchCities()
    }, [token, stateName])

    return (
        <div className='input-field-container'>
            <label htmlFor='city'>City</label>
            <select name='city' id='city' onChange={(e => onCityChange(e.target.value))}>
                {cityValues.map((item, idx) => (<option key={`city-option-${idx}`} value={item.city_name}>{item.city_name}</option>))}
            </select>
        </div>
    )
}