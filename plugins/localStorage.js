export default function ({ store }) {
  if (process.client) {
    store.subscribe((mutation, state) => {
      if (mutation.type === 'SET_USER' || mutation.type === 'SET_TOKEN') {
        if (state.user && state.token) {
          localStorage.setItem('userEmail', state.user.email)
          localStorage.setItem('userUid', state.user.uid)
          localStorage.setItem('token', state.token)
          if (state.tokenExpiration) {
            localStorage.setItem('tokenExpiration', state.tokenExpiration)
          }
        }
      }
      
      if (mutation.type === 'CLEAR_AUTH') {
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userUid')
      }
    })
  }
}
