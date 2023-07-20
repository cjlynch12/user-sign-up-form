import { useEffect, useState } from "react"

// This is not ideal, normally this would be proxied via server request and gated by user authN or derived from a JWT instead of hard coded client side
const API_TOKEN = 'w-L9E5X93uiJsHy2Hfo8etmcvX5b7KqiN_585tN99MFWA4fS8fwQFlzjkx_8n3aqHzY'
const USER_EMAIL = 'c.lynch12@gmail.com'

type TokenType = 'universal-tutorial'
type Token = string | undefined
type TokenConfig = {
    getToken: () => Promise<Token | undefined>
}
const getUniversalTutorialToken = async () => {
    try {
        const request = await fetch('https://www.universal-tutorial.com/api/getaccesstoken', { method: 'GET', headers: { "Accept": "application/json", "api-token": API_TOKEN, "user-email": USER_EMAIL } })
        const body = await request.json()
        const token = body.auth_token
        if (typeof token === "string") return token
    } catch (e) {
        console.error("Token request failed...")
        throw e
    }
}

const tokenConfigs: Record<TokenType, TokenConfig> = {
    'universal-tutorial': {
        getToken: getUniversalTutorialToken
    }
}
export const useAccessTokens = (tokenType: TokenType) => {
    const [token, setToken] = useState<string>()

    // fetch token on app init
    // this could be replaced with a cookie for session persistence
    useEffect(() => {
        const fetchToken = async () => {
            const newToken = await tokenConfigs[tokenType].getToken()
            if (newToken) {
                setToken(newToken)
            }
        }
        if (!token) {
            fetchToken()
        }
    }, [token])

    return { token }
}