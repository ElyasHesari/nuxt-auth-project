import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

export const state = () => ({
  user: null,
  token: null,
  tokenExpiration: null,
  logoutTimer: null
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
  }
}

export const actions = {
  async signup({ commit, dispatch }, { email, password }) {
    try {
      const auth = this.$firebaseAuth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const token = await user.getIdToken()
      const tokenResult = await user.getIdTokenResult()
      
      commit('SET_USER', {
        email: user.email,
        uid: user.uid
      })
      commit('SET_TOKEN', token)
      
      const expirationTime = new Date(tokenResult.expirationTime).getTime()
      commit('SET_TOKEN_EXPIRATION', expirationTime)
      
      dispatch('saveAuthToStorage', {
        token,
        expirationTime,
        email: user.email,
        uid: user.uid
      })
      
      dispatch('setLogoutTimer', expirationTime - Date.now())
      
      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  },

  async login({ commit, dispatch }, { email, password }) {
    try {
      const auth = this.$firebaseAuth
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const token = await user.getIdToken()
      const tokenResult = await user.getIdTokenResult()
      
      commit('SET_USER', {
        email: user.email,
        uid: user.uid
      })
      commit('SET_TOKEN', token)
      
      const expirationTime = new Date(tokenResult.expirationTime).getTime()
      commit('SET_TOKEN_EXPIRATION', expirationTime)
      
      dispatch('saveAuthToStorage', {
        token,
        expirationTime,
        email: user.email,
        uid: user.uid
      })
      
      dispatch('setLogoutTimer', expirationTime - Date.now())
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async logout({ commit }) {
    try {
      const auth = this.$firebaseAuth
      await signOut(auth)
      
      commit('CLEAR_AUTH')
      
      if (process.client) {
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userUid')
      }
      
      this.$router.push('/login')
      
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

  tryAutoLogin({ commit, dispatch }) {
    if (!process.client) return

    const token = localStorage.getItem('token')
    const expirationTime = localStorage.getItem('tokenExpiration')
    const email = localStorage.getItem('userEmail')
    const uid = localStorage.getItem('userUid')

    if (!token || !expirationTime) {
      return
    }

    const now = Date.now()
    const expiresIn = +expirationTime - now

    if (expiresIn < 0) {
      dispatch('logout')
      return
    }

    commit('SET_TOKEN', token)
    commit('SET_TOKEN_EXPIRATION', expirationTime)
    commit('SET_USER', { email, uid })
    
    dispatch('setLogoutTimer', expiresIn)
  },

  setLogoutTimer({ commit, dispatch }, expiresIn) {
    const timer = setTimeout(() => {
      dispatch('logout')
    }, expiresIn)
    commit('SET_LOGOUT_TIMER', timer)
  },

  initAuth({ dispatch }) {
    if (process.client) {
      dispatch('tryAutoLogin')
      
      const auth = this.$firebaseAuth
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          dispatch('logout')
        }
      })
    }
  }
}

export const getters = {
  isAuthenticated(state) {
    return !!state.token && !!state.user
  },
  getUser(state) {
    return state.user
  },
  getUserEmail(state) {
    return state.user ? state.user.email : null
  }
}