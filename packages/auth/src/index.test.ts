import {jest, describe, it, expect, beforeEach} from '@jest/globals'
import {JSDOM} from 'jsdom'
import Auth from './index'

describe('Auth', () => {
  let auth: Auth
  let mockPut: jest.Mock
  let mockGet: jest.Mock

  beforeEach(() => {
    mockPut = jest.fn()
    mockGet = jest.fn()
    auth = new Auth({server: 'http://test.com'})
    ;(auth.Put as jest.Mock) = mockPut
    ;(auth.Get as jest.Mock) = mockGet
  })

  describe('login', () => {
    it('should login with SESSION_TOKEN', async () => {
      mockPut.mockResolvedValue({session_token: 'test_session_token'})
      const result = await auth.login({login: 'user', password: 'pass', storage: 'session_token'})
      expect(result).toBe(true)
      expect(auth.sessionToken).toBe('test_session_token')
    })

    it('should login with API_TOKEN', async () => {
      mockPut.mockResolvedValue({session_token: 'test_session_token'})
      mockGet.mockResolvedValue({api_token: 'test_api_token'})
      const result = await auth.login({login: 'user', password: 'pass', storage: 'api_token'})
      expect(result).toBe(true)
      expect(auth.apiToken).toBe('test_api_token')
    })
  })

  describe('isLoggedIn', () => {
    it('should return true when sessionToken exists', () => {
      auth.sessionToken = 'test_session_token'
      expect(auth.isLoggedIn()).toBe(true)
    })

    it('should return true when apiToken exists', () => {
      auth.apiToken = 'test_api_token'
      expect(auth.isLoggedIn()).toBe(true)
    })
  })

  describe('me', () => {
    it('should return user data when logged in', async () => {
      auth.sessionToken = 'test_session_token'
      mockGet.mockResolvedValue({id: 1, name: 'Test User'})
      const result = await auth.me()
      expect(result).toEqual({id: 1, name: 'Test User'})
    })

    it('should return null when not logged in', async () => {
      const result = await auth.me()
      expect(result).toBeNull()
    })

    it('should logout and return null on unauthorized error', async () => {
      auth.sessionToken = 'test_session_token'
      mockGet.mockRejectedValue(new Error('Unauthorised'))
      const logoutSpy = jest.spyOn(auth, 'logout').mockResolvedValue(true)
      const result = await auth.me()
      expect(result).toBeNull()
      expect(logoutSpy).toHaveBeenCalled()
    })
  })

  describe('makeHeaders', () => {
    it('should create headers with session token', () => {
      const headers = auth.makeHeaders({sessionToken: 'test_session_token'})
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Session-Token': 'test_session_token',
      })
    })

    it('should create headers with API token', () => {
      const headers = auth.makeHeaders({apiToken: 'test_api_token'})
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Api-Token': 'test_api_token',
      })
    })

    it('should prioritize session token over API token', () => {
      const headers = auth.makeHeaders({
        sessionToken: 'test_session_token',
        apiToken: 'test_api_token',
      })
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Session-Token': 'test_session_token',
      })
    })
  })

  describe('Tests with document object', () => {
    let originalGlobal: any

    beforeEach(() => {
      originalGlobal = global
      const dom = new JSDOM('<!doctype html><html><body></body></html>')
      global.document = dom.window.document
      global.window = dom.window as any as Window & typeof globalThis
    })

    afterEach(() => {
      global = originalGlobal
    })

    it('should clear session cookie', async () => {
      document.cookie = 'sessionId=test_session_id'
      await auth.logout()
      expect(document.cookie).not.toContain('sessionId=test_session_id')
    })

    it('should login with COOKIE', async () => {
      const mockSetSession = jest.spyOn(auth, 'setSession').mockResolvedValue(true)
      mockPut.mockResolvedValue({
        session_token: 'test_session_token',
        token_expiration: '2023-06-01T00:00:00Z',
      })
      const result = await auth.login({login: 'user', password: 'pass', storage: 'cookie'})
      expect(result).toBe(true)
      expect(mockSetSession).toHaveBeenCalled()
    })

    it('should set session cookie and update auth instance', async () => {
      document.cookie = 'sessionId=test_session_id'

      const response = {
        session_token: 'new_session_token',
        token_expiration: '2023-06-01T00:00:00Z',
      }
      await auth.setSession(response)

      expect(auth.sessionToken).toBe('new_session_token')
      expect(auth.headers['Session-Token']).toBe('new_session_token')
    })

    it('should return false when no session exists', () => {
      document.cookie = ''
      auth.sessionToken = undefined
      auth.apiToken = undefined
      expect(auth.isLoggedIn()).toBe(false)
    })
  })
})
