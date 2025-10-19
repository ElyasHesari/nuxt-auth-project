<template>
  <b-navbar toggleable="lg" type="dark" variant="primary">
    <b-container>
      <b-navbar-brand to="/">سیستم احراز هویت</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="mr-auto">
          <b-nav-item to="/">خانه</b-nav-item>
          
          <template v-if="!isAuthenticated">
            <b-nav-item to="/login">ورود</b-nav-item>
            <b-nav-item to="/register">ثبت نام</b-nav-item>
          </template>

          <template v-else>
            <b-nav-item to="/dashboard">داشبورد</b-nav-item>
            <b-nav-item @click="handleLogout">
              <b-icon icon="box-arrow-right" class="ml-1"></b-icon>
              خروج
            </b-nav-item>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    async handleLogout() {
      try {
        await this.$store.dispatch('logout')
        this.$bvToast.toast('با موفقیت خارج شدید', {
          title: 'خروج',
          variant: 'success',
          solid: true
        })
      } catch (error) {
        this.$bvToast.toast('خطا در خروج از حساب کاربری', {
          title: 'خطا',
          variant: 'danger',
          solid: true
        })
      }
    }
  }
}
</script>