import auth0 from 'auth0-js'
import router from '../router'

export default class AuthService {
  authenticated = this.isAuthenticated()

  constructor () {
    this.login = this.login.bind(this)
    this.setSession = this.setSession.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
  }

  auth0 = new auth0.WebAuth({
    domain: 'jstillerman.auth0.com',
    clientID: 'Sz8Tff0GALK7lTp7bPRoUVxh228FAWNB',
    redirectUri: 'http://localhost:8080/callback',
    audience: 'https://jstillerman.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid'
  })

  login () {
    this.auth0.authorize()
  }
  handleAuthentication () {
    this.auth0.parseHash((err, authResult) => {
      console.log('HANDLEAUTH CALLED', authResult)
      if (authResult && authResult.idToken) {
        this.setSession(authResult)
        console.log('success')
        router.push('entry')
      }
      else if (err) {
        router.push('timeline')
        console.log(err)
      }
    })
  }

  setSession (authResult) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    )
    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
  }

  logout () {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    this.userProfile = null
    // navigate to the home route
    router.replace('entry')
  }

  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }
}
