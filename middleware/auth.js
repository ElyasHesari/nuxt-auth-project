export default function ({ store, redirect }) {
  // فقط در سمت کلاینت بررسی احراز هویت کنیم
  if (!process.client) {
    return
  }

  // بررسی احراز هویت
  if (!store.getters.isAuthenticated) {
    return redirect('/login')
  }
}