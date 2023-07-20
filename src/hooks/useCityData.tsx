import { useEffect, useState } from "react"
import { useAccessTokens } from "./useAccessTokens"

// ensure response is valid, non-empty, and contains proper keys
const isCitiesResponse = (body: any): body is Array<{ city_name: string }> => {
    return !!body && Array.isArray(body) && body.length > 0 && Object.keys(body[0]).includes('city_name')
}

export const useCityData = (stateName?: string) => {
    const [cityValues, setCityValues] = useState<Array<{ city_name: string }>>([])
    const [loading, setLoading] = useState(false)

    const { token } = useAccessTokens('universal-tutorial')
    const fetchCities = async (stateName: string) => {
        try {
            if (token && stateName) {
                setLoading(true)
                const request = await fetch(`https://www.universal-tutorial.com/api/cities/${stateName}`, { method: 'GET', headers: { "Accept": "application/json", 'Authorization': `Bearer ${token}` } })
                const body = await request.json()
                setLoading(false)
                if (isCitiesResponse(body)) {

                    return body
                } else {
                    return []
                }
            }
        } catch (e) {
            setLoading(false)
            console.error('Could not fetch cities...')
            throw e
        }
    }

    useEffect(() => {
        const doFetchCities = async (stateName?: string) => {
            if (stateName) {
                const result = await fetchCities(stateName)
                if (result) {
                    setCityValues(result)
                    // onCityChange(result[0].city_name)
                }
            }
        }

        doFetchCities(stateName)
    }, [token, stateName])

    return {cityValues, loading}
}