import Auth from './index'
import BaseAPI from '@equistamp/server'

describe('Auth', () => {
  let auth: Auth
  let mockPut: jest.Mock
  let mockGet: jest.Mock

  beforeEach(() => {
    mockPut = jest.fn()
    mockGet = jest.fn()
    ;(BaseAPI.prototype.Put as jest.Mock) = mockPut
    ;(BaseAPI.prototype.Get as jest.Mock) = mockGet
    auth = new Auth({server: 'http://test.com'})
  })

  describe('login', () => {
    it('should login with SESSION_TOKEN', async () => {
      mockPut.mockResolvedValue({session_token: 'test_session_token'})
      const result = await auth.login({login: 'user', password: 'pass', storage: 'session_token'})
      expect(result).toBe(true)
      expect(auth.sessionToken).toBe('test_session_token')
    })

    it('should login with API_TOKEN', async () => {
      mockPut.mockResolvedValue({api_token: 'test_api_token'})
      const result = await auth.login({login: 'user', password: 'pass', storage: 'api_token'})
      expect(result).toBe(true)
      expect(auth.apiToken).toBe('test_api_token')
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
  })

  describe('logout', () => {
    it('should clear session cookie', async () => {
      document.cookie = 'sessionId=test_session_id'
      await auth.logout()
      expect(document.cookie).not.toContain('sessionId=test_session_id')
    })
  })

  describe('isLoggedIn', () => {
    it('should return true when session cookie exists', () => {
      document.cookie = 'sessionId=test_session_id'
      expect(auth.isLoggedIn()).toBe(true)
    })

    it('should return true when sessionToken exists', () => {
      auth.sessionToken = 'test_session_token'
      expect(auth.isLoggedIn()).toBe(true)
    })

    it('should return true when apiToken exists', () => {
      auth.apiToken = 'test_api_token'
      expect(auth.isLoggedIn()).toBe(true)
    })

    it('should return false when no session exists', () => {
      document.cookie = ''
      auth.sessionToken = undefined
      auth.apiToken = undefined
      expect(auth.isLoggedIn()).toBe(false)
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

  describe('setSession', () => {
    it('should set session cookie and update auth instance', async () => {
      const mockSetCookie = jest.fn()
      Object.defineProperty(document, 'cookie', {
        set: mockSetCookie,
        configurable: true,
      })

      const response = {
        session_token: 'new_session_token',
        token_expiration: '2023-06-01T00:00:00Z',
      }
      await auth.setSession(response)

      expect(mockSetCookie).toHaveBeenCalledWith(
        expect.stringContaining('sessionId=new_session_token'),
      )
      expect(mockSetCookie).toHaveBeenCalledWith(
        expect.stringContaining('expires=Thu, 01 Jun 2023 00:00:00 GMT'),
      )
      expect(mockSetCookie).toHaveBeenCalledWith(
        expect.stringContaining('path=/; SameSite=Strict; Secure'),
      )
      expect(auth.sessionToken).toBe('new_session_token')
      expect(auth.headers['Session-Token']).toBe('new_session_token')
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
})
