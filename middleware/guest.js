export default async function ({ store, redirect }) {
  if (!process.client) {
    return
  }

  await store.dispatch('tryAutoLogin')
  
  let attempts = 0
  const maxAttempts = 10
  while (!store.getters.isInitialized && attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 100))
    attempts++
  }

  if (store.getters.isAuthenticated) {
    return redirect('/')
  }
}