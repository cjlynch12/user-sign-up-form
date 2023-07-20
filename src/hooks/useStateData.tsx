import { useEffect, useState } from "react"
import { useAccessTokens } from "./useAccessTokens"

// ensure response is valid, non-empty, and contains proper keys
const isStateResponse = (body: any): body is Array<{ state_name: string }> => {
    return !!body && Array.isArray(body) && body.length > 0 && Object.keys(body[0]).includes('state_name')
}

export const useStateData = () => {
    const [stateValues, setStateValues] = useState<Array<{ state_name: string }>>([])
    const [loading, setLoading] = useState(false)
    const { token } = useAccessTokens('universal-tutorial')
    const fetchStates = async () => {
        try {
            if (token) {
                setLoading(true)
                const request = await fetch('https://www.universal-tutorial.com/api/states/United States', { method: 'GET', headers: { "Accept": "application/json", 'Authorization': `Bearer ${token}` } })
                const body = await request.json()
                setLoading(false)
                if (isStateResponse(body)) {

                    return body
                } else {
                    return []
                }
            }
        } catch (e) {
            setLoading(false)
            console.error('Could not fetch states...')
            throw e
        }
    }

    useEffect(() => {
        const doFetchStates = async () => {
            const result = await fetchStates()
            if (result) {
                setStateValues(result)
                // onStateChange(result[0].state_name)
            }
        }

        doFetchStates()
    }, [token])

    return {stateValues, loading}
}