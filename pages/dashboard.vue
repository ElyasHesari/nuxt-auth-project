<template>
  <div>
    <b-row class="justify-content-center">
      <b-col md="8">
        <b-card title="داشبورد کاربر" class="mt-5">
          <b-card-text>
            <h4 class="mb-4">خوش آمدید! 👋</h4>
            
            <b-list-group>
              <b-list-group-item>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>ایمیل:</strong>
                  </div>
                  <div>
                    <b-badge variant="primary" pill>{{ userEmail }}</b-badge>
                  </div>
                </div>
              </b-list-group-item>
              
              <b-list-group-item>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>وضعیت:</strong>
                  </div>
                  <div>
                    <b-badge variant="success" pill>فعال</b-badge>
                  </div>
                </div>
              </b-list-group-item>

              <b-list-group-item>
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>تاریخ ورود:</strong>
                  </div>
                  <div>
                    <b-badge variant="info" pill>{{ currentDate }}</b-badge>
                  </div>
                </div>
              </b-list-group-item>
            </b-list-group>

            <b-alert variant="success" show class="mt-4">
              <h5 class="alert-heading">شما با موفقیت وارد شده‌اید!</h5>
              <p class="mb-0">
                این داشبورد کاربری شماست. می‌توانید اطلاعات حساب کاربری خود را مشاهده کنید.
              </p>
            </b-alert>

            <b-card bg-variant="light" class="mt-4">
              <b-card-title>اطلاعات امنیتی</b-card-title>
              <b-card-text>
                <ul class="mb-0">
                  <li>نشست شما به صورت خودکار پس از مدت زمان مشخصی منقضی می‌شود</li>
                  <li>برای امنیت بیشتر، پس از استفاده خارج شوید</li>
                  <li>اطلاعات شما با Firebase محافظت می‌شود</li>
                </ul>
              </b-card-text>
            </b-card>

            <div class="text-center mt-4">
              <b-button variant="danger" @click="handleLogout" size="lg">
                <b-icon icon="box-arrow-right" class="mr-2"></b-icon>
                خروج از حساب کاربری
              </b-button>
            </div>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',
  middleware: 'client-auth',
  data() {
    return {
      currentDate: new Date().toLocaleDateString('fa-IR')
    }
  },
  computed: {
    userEmail() {
      return this.$store.getters.getUserEmail || 'کاربر'
    }
  },
  async mounted() {
    if (process.client) {
      await this.$store.dispatch('tryAutoLogin')
      if (!this.$store.getters.isAuthenticated) {
        this.$router.push('/login')
      }
    }
  },
  methods: {
    async handleLogout() {
      const confirmed = await this.$bvModal.msgBoxConfirm(
        'آیا مطمئن هستید که می‌خواهید خارج شوید؟',
        {
          title: 'تأیید خروج',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'بله، خارج شو',
          cancelTitle: 'انصراف',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        }
      )

      if (confirmed) {
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
}
</script>

<style scoped>
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>