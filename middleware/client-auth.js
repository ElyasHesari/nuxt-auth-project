export default async function ({ store, redirect }) {
  // فقط در سمت کلاینت اجرا شود
  if (!process.client) {
    return
  }

  // ابتدا سعی کنیم auto-login کنیم
  await store.dispatch('tryAutoLogin')
  
  // اگر هنوز initialize نشده، منتظر بمانیم
  if (!store.getters.isInitialized) {
    // کمی منتظر بمانیم تا store initialize شود
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // بررسی نهایی احراز هویت
  if (!store.getters.isAuthenticated) {
    return redirect('/login')
  }
}
