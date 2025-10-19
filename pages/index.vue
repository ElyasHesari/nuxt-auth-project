<template>
  <div>
    <b-jumbotron header="خوش آمدید" lead="سیستم احراز هویت با Nuxt.js و Firebase">
      <p>این یک پروژه نمونه برای احراز هویت کاربران است.</p>
      <b-button v-if="!isAuthenticated" variant="primary" to="/register" size="lg">
        ثبت نام کنید
      </b-button>
      <b-button v-else variant="success" to="/dashboard" size="lg">
        برو به داشبورد
      </b-button>
    </b-jumbotron>

    <b-row>
      <b-col md="4">
        <b-card title="ثبت نام" class="mb-3">
          <b-card-text>
            برای استفاده از سیستم، ابتدا ثبت نام کنید.
          </b-card-text>
          <b-button v-if="!isAuthenticated" variant="primary" to="/register">ثبت نام</b-button>
        </b-card>
      </b-col>

      <b-col md="4">
        <b-card title="ورود" class="mb-3">
          <b-card-text>
            اگر قبلاً ثبت نام کرده‌اید، وارد شوید.
          </b-card-text>
          <b-button v-if="!isAuthenticated" variant="success" to="/login">ورود</b-button>
        </b-card>
      </b-col>

      <b-col md="4">
        <b-card title="داشبورد" class="mb-3">
          <b-card-text>
            مشاهده اطلاعات حساب کاربری خود.
          </b-card-text>
          <b-button v-if="isAuthenticated" variant="info" to="/dashboard">داشبورد</b-button>
          <b-badge v-else variant="secondary">نیاز به ورود</b-badge>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>