export default async function ({ store }) {
  if (process.client) {
    await store.dispatch('tryAutoLogin')
  }
}
