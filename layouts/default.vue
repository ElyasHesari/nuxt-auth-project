<template>
  <div>
    <Navbar />
    <b-container class="mt-4">
      <Nuxt />
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  mounted() {
    this.$store.dispatch('initAuth')
  }
}
</script>

<style>
html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>