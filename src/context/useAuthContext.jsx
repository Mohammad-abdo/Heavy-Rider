import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import Cookies from 'universal-cookie'
import { authAPI } from '../api/api' // ✅ عدّل المسار لو لازم
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(undefined)
const cookies = new Cookies()
const authSessionKey = '_Heavy Ride_AUTH_KEY_'

const parseStoredUser = (value) => {
  if (!value) return undefined
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return undefined
    try {
      return JSON.parse(trimmed)
    } catch (err) {
      return undefined
    }
  }
  if (typeof value === 'object') return value
  return undefined
}

const normalizeToken = (value) => {
  if (!value) return null
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed || trimmed === '[object Object]' || trimmed === 'undefined' || trimmed === 'null') return null
    return trimmed
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const normalized = normalizeToken(item)
      if (normalized) return normalized
    }
  } else if (typeof value === 'object') {
    const keys = [
      'token',
      'access_token',
      'accessToken',
      'plainTextToken',
      'plain_text_token',
      'authToken',
      'auth_token',
      'value',
      'bearer_token',
      'bearerToken',
    ]
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        const candidate = value[key]
        if (candidate && candidate === value) continue
        const normalized = normalizeToken(candidate)
        if (normalized) return normalized
      }
    }
  }
  return null
}

const resolveRole = (data) => {
  if (!data) return null
  const roleValue = data.role || data.user_role || data.type || data.user_type || data.userRole || null
  return roleValue ? roleValue.toLowerCase().trim() : null
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const getSession = () => {
    try {
      const cookieUserRaw = cookies.get('user')
      const cookieUser = parseStoredUser(cookieUserRaw)
      if (!cookieUser && cookieUserRaw) {
        cookies.remove('user', { path: '/' })
      }
      if (cookieUser) return cookieUser
      if (typeof window !== 'undefined') {
        const storageUserRaw = window.localStorage.getItem('user')
        const storageUser = parseStoredUser(storageUserRaw)
        if (!storageUser && storageUserRaw) {
          window.localStorage.removeItem('user')
        }
        return storageUser
      }
      return undefined
    } catch (err) {
      console.error('Failed to load session:', err)
      return undefined
    }
  }

  const getToken = () => {
    try {
      const cookieTokenRaw = cookies.get('token')
      const cookieToken = normalizeToken(cookieTokenRaw)
      if (!cookieToken && cookieTokenRaw) {
        cookies.remove('token', { path: '/' })
      }
      if (cookieToken) return cookieToken
      if (typeof window !== 'undefined') {
        const storageTokenRaw = window.localStorage.getItem('token')
        const storageToken = normalizeToken(storageTokenRaw)
        if (!storageToken && storageTokenRaw) {
          window.localStorage.removeItem('token')
        }
        return storageToken
      }
      return null
    } catch (err) {
      console.error('Failed to load token:', err)
      return null
    }
  }

  const [user, setUser] = useState(() => getSession())
  const [token, setToken] = useState(() => getToken())
  const [role, setRole] = useState(() => resolveRole(getSession()))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const extractRole = useCallback(resolveRole, [])

  const saveSession = (userData, tokenData) => {
    const normalizedToken = normalizeToken(tokenData)
    if (!userData || !normalizedToken) return
    setUser(userData)
    setRole(extractRole(userData))
    setToken(normalizedToken)
    cookies.set('user', JSON.stringify(userData), { path: '/', maxAge: 86400 * 7 })
    cookies.set('token', normalizedToken, { path: '/', maxAge: 86400 * 7 })
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('user', JSON.stringify(userData))
      window.localStorage.setItem('token', normalizedToken)
    }
  }

  const removeSession = () => {
    cookies.remove('user', { path: '/' })
    cookies.remove('token', { path: '/' })
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('user')
      window.localStorage.removeItem('token')
    }
    setUser(undefined)
    setToken(null)
    setRole(null)
    navigate('/auth/sign-in')
  }

  // 🔐 Login
  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.login(email, password)
      const tokenData =
        res.data?.data?.token ?? res.data?.data?.access_token ?? res.data?.token ?? res.data?.auth_token ?? res.data?.access_token ?? null
      const userData = res.data?.data?.user ?? res.data?.user ?? res.data?.data ?? null
      const normalizedToken = normalizeToken(tokenData)

      if (!normalizedToken || !userData) {
        throw new Error('Invalid login response: missing token or user')
      }

      saveSession(userData, normalizedToken)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      setError(msg)
      console.error('Login error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 🧾 Register
  const register = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authAPI.register(formData)
      const tokenData = res.data?.data?.token || res.data?.token || res.data?.auth_token || null
      const userData = res.data?.data?.user || res.data?.user || res.data?.data || null

      if (!tokenData || !userData) {
        throw new Error('Invalid register response')
      }

      saveSession(userData, tokenData)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setError(msg)
      console.error('Register error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 👤 Get Profile
  const profileData = async () => {
    try {
      const res = await authAPI.getProfile()
      const userData = res.data?.data || res.data
      if (userData) {
        saveSession(userData, token)
      }
      return userData
    } catch (err) {
      console.error('Profile fetch failed:', err)
      throw err
    }
  }
  const [profileLoaded, setProfileLoaded] = useState(false)

  useEffect(() => {
    if (token && !user && !profileLoaded) {
      profileData().finally(() => setProfileLoaded(true))
    }
  }, [token, user, profileLoaded])

  // 🚪 Logout
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.warn('Logout request failed:', err)
    } finally {
      removeSession()
    }
  }

  // 🔄 Auto-sync profile when token exists but user not loaded

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        loading,
        error,
        isAuthenticated: !!token,
        isAdmin: role === 'admin',
        isDriver: role === 'driver',
        isRider: role === 'rider' || role === 'user',
        saveSession,
        removeSession,
        login,
        logout,
        register,
        profileData,
      }}>
      {children}
    </AuthContext.Provider>
  )
}
