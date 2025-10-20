export default function ({ store }) {
  // فقط در سمت کلاینت اجرا شود
  if (process.client) {
    // گوش دادن به تغییرات store برای ذخیره خودکار در localStorage
    store.subscribe((mutation, state) => {
      // ذخیره خودکار تغییرات احراز هویت
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
      
      // پاک کردن localStorage هنگام logout
      if (mutation.type === 'CLEAR_AUTH') {
        localStorage.removeItem('token')
        localStorage.removeItem('tokenExpiration')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userUid')
      }
    })
  }
}
