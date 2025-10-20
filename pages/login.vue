<template>
  <b-row class="justify-content-center">
    <b-col md="6">
      <b-card title="ورود" class="mt-5">
        <b-form @submit.prevent="handleLogin">
          <b-form-group label="ایمیل:" label-for="email">
            <b-form-input
              id="email"
              v-model="$v.form.email.$model"
              type="email"
              placeholder="example@email.com"
              :state="validateState('email')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.email.required">
              ایمیل الزامی است
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="!$v.form.email.email">
              فرمت ایمیل صحیح نیست
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="رمز عبور:" label-for="password">
            <b-form-input
              id="password"
              v-model="$v.form.password.$model"
              type="password"
              placeholder="رمز عبور خود را وارد کنید"
              :state="validateState('password')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.password.required">
              رمز عبور الزامی است
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="!$v.form.password.minLength">
              رمز عبور باید حداقل 6 کاراکتر باشد
            </b-form-invalid-feedback>
          </b-form-group>

          <b-alert v-if="error" variant="danger" show dismissible @dismissed="error=''">
            {{ error }}
          </b-alert>

          <b-button
            type="submit"
            variant="primary"
            block
            :disabled="loading || $v.form.$invalid"
          >
            <b-spinner v-if="loading" small></b-spinner>
            {{ loading ? 'در حال ورود...' : 'ورود' }}
          </b-button>

          <div class="text-center mt-3">
            <small>
              حساب کاربری ندارید؟
              <nuxt-link to="/register">ثبت نام کنید</nuxt-link>
            </small>
          </div>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'LoginPage',
  middleware: 'guest',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    }
  },
  async mounted() {
    if (process.client) {
      await this.$store.dispatch('tryAutoLogin')
      if (this.$store.getters.isAuthenticated) {
        this.$router.push('/')
      }
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    async handleLogin() {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) {
        return
      }

      this.loading = true
      this.error = ''

      try {
        await this.$store.dispatch('login', {
          email: this.form.email,
          password: this.form.password
        })

        this.$bvToast.toast('ورود با موفقیت انجام شد', {
          title: 'موفق',
          variant: 'success',
          solid: true
        })

        this.$router.push('/dashboard')
      } catch (error) {
        console.error('Login error:', error)
        
        if (error.code && error.message) {
          switch (error.code) {
            case 'auth/user-not-found':
              this.error = 'کاربری با این ایمیل یافت نشد'
              break
            case 'auth/wrong-password':
              this.error = 'رمز عبور اشتباه است'
              break
            case 'auth/invalid-email':
              this.error = 'فرمت ایمیل نامعتبر است'
              break
            case 'auth/user-disabled':
              this.error = 'این حساب کاربری غیرفعال شده است'
              break
            case 'auth/too-many-requests':
              this.error = 'تعداد تلاش‌های ناموفق زیاد است. لطفاً بعداً تلاش کنید'
              break
            case 'auth/invalid-credential':
              this.error = 'ایمیل یا رمز عبور اشتباه است'
              break
            default:
              this.error = error.message || 'خطا در ورود'
          }
        } else {
          this.error = error.message || 'خطا در ورود'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>