export const state = () => ({
  user: null,
  token: null,
  tokenExpiration: null,
  logoutTimer: null,
  isInitialized: false
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_TOKEN_EXPIRATION(state, expiration) {
    state.tokenExpiration = expiration
  },
  SET_LOGOUT_TIMER(state, timer) {
    state.logoutTimer = timer
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.token = null
    state.tokenExpiration = null
    if (state.logoutTimer) {
      clearTimeout(state.logoutTimer)
      state.logoutTimer = null
    }
  },
  SET_INITIALIZED(state, value) {
    state.isInitialized = value
  }
}

export const actions = {
  async signup({ commit, dispatch }, { email, password }) {
    try {
      const apiKey = this.$config.firebaseApiKey
      
      const response = await this.$axios.$post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      
      const token = response.idToken
      const userId = response.localId
      const expiresIn = +response.expiresIn * 1000
      const expirationTime = Date.now() + expiresIn
      
      commit('SET_USER', {
        email,
        uid: userId
      })
      commit('SET_TOKEN', token)
      commit('SET_TOKEN_EXPIRATION', expirationTime)
      
      // ذخیره در localStorage
      dispatch('saveAuthToStorage', {
        token,
        expirationTime,
        email,
        uid: userId
      })
      
      dispatch('setLogoutTimer', expiresIn)
      
      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      
      const errorMessage = error.response?.data?.error?.message || error.message
      const firebaseError = {
        code: this.convertFirebaseError(errorMessage),
        message: errorMessage
      }
      throw firebaseError
    }
  },

  async login({ commit, dispatch }, { email, password }) {
    try {
      const apiKey = this.$config.firebaseApiKey
      
      const response = await this.$axios.$post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      
      const token = response.idToken
      const userId = response.localId
      const userEmail = response.email
      const expiresIn = +response.expiresIn * 1000
      const expirationTime = Date.now() + expiresIn
      
      commit('SET_USER', {
        email: userEmail,
        uid: userId
      })
      commit('SET_TOKEN', token)
      commit('SET_TOKEN_EXPIRATION', expirationTime)
      
      dispatch('saveAuthToStorage', {
        token,
        expirationTime,
        email: userEmail,
        uid: userId
      })
      
      dispatch('setLogoutTimer', expiresIn)
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      
      const errorMessage = error.response?.data?.error?.message || error.message
      const firebaseError = {
        code: this.convertFirebaseError(errorMessage),
        message: errorMessage
      }
      throw firebaseError
    }
  },

  async logout({ commit }) {
    try {
      commit('CLEAR_AUTH')
      
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userUid')
      }
      
      if (process.client && this.$router) {
        const currentRoute = this.$router.currentRoute.path
        if (currentRoute === '/dashboard') {
          this.$router.push('/login')
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  saveAuthToStorage({ commit }, { token, expirationTime, email, uid }) {
    if (process.client) {
      localStorage.setItem('token', token)
      localStorage.setItem('tokenExpiration', expirationTime)
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userUid', uid)
    }
  },

  tryAutoLogin({ commit, dispatch, state }) {
    if (!process.client) {
      commit('SET_INITIALIZED', true)
      return false
    }

    // اگر قبلاً در store موجود است، نیازی به بازیابی نیست
    if (state.token && state.user) {
      commit('SET_INITIALIZED', true)
      return true
    }

    const token = localStorage.getItem('token')
    const expirationTime = localStorage.getItem('tokenExpiration')
    const email = localStorage.getItem('userEmail')
    const uid = localStorage.getItem('userUid')

    if (!token || !expirationTime || !email || !uid) {
      commit('SET_INITIALIZED', true)
      return false
    }

    const now = Date.now()
    const expiresIn = +expirationTime - now

    if (expiresIn < 0) {
      // توکن منقضی شده - پاک کردن localStorage
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userUid')
      }
      commit('SET_INITIALIZED', true)
      return false
    }

    // بازیابی اطلاعات احراز هویت
    commit('SET_TOKEN', token)
    commit('SET_TOKEN_EXPIRATION', +expirationTime)
    commit('SET_USER', { email, uid })
    
    // تنظیم تایمر logout
    dispatch('setLogoutTimer', expiresIn)
    
    commit('SET_INITIALIZED', true)
    return true
  },

  setLogoutTimer({ commit, dispatch }, expiresIn) {
    if (this.state.logoutTimer) {
      clearTimeout(this.state.logoutTimer)
    }
    
    const timer = setTimeout(() => {
      dispatch('logout')
    }, expiresIn)
    commit('SET_LOGOUT_TIMER', timer)
  },

  convertFirebaseError(errorMessage) {
    const errorMap = {
      'EMAIL_EXISTS': 'auth/email-already-in-use',
      'OPERATION_NOT_ALLOWED': 'auth/operation-not-allowed',
      'TOO_MANY_ATTEMPTS_TRY_LATER': 'auth/too-many-requests',
      'EMAIL_NOT_FOUND': 'auth/user-not-found',
      'INVALID_PASSWORD': 'auth/wrong-password',
      'INVALID_LOGIN_CREDENTIALS': 'auth/invalid-credential',
      'USER_DISABLED': 'auth/user-disabled',
      'INVALID_EMAIL': 'auth/invalid-email',
      'WEAK_PASSWORD': 'auth/weak-password'
    }
    
    return errorMap[errorMessage] || 'auth/unknown-error'
  }
}

export const getters = {
  isAuthenticated(state) {
    return !!state.token && !!state.user && state.isInitialized
  },
  getUser(state) {
    return state.user
  },
  getUserEmail(state) {
    return state.user ? state.user.email : null
  },
  isInitialized(state) {
    return state.isInitialized
  }
}