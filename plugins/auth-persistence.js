export default async function ({ store }) {
  // فقط در سمت کلاینت اجرا شود
  if (process.client) {
    // بازیابی وضعیت احراز هویت هنگام بارگذاری صفحه
    await store.dispatch('tryAutoLogin')
  }
}
