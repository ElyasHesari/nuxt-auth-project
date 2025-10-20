<template>
  <b-row class="justify-content-center">
    <b-col md="6">
      <b-card title="ثبت نام" class="mt-5">
        <b-form @submit.prevent="handleRegister">
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
              placeholder="حداقل 6 کاراکتر"
              :state="validateState('password')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.password.required">
              رمز عبور الزامی است
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="!$v.form.password.minLength">
              رمز عبور باید حداقل 6 کاراکتر باشد
            </b-form-invalid-feedback>
          </b-form-group>

          <b-form-group label="تکرار رمز عبور:" label-for="confirmPassword">
            <b-form-input
              id="confirmPassword"
              v-model="$v.form.confirmPassword.$model"
              type="password"
              placeholder="تکرار رمز عبور"
              :state="validateState('confirmPassword')"
            ></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.confirmPassword.required">
              تکرار رمز عبور الزامی است
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="!$v.form.confirmPassword.sameAsPassword">
              رمز عبور و تکرار آن یکسان نیستند
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
            {{ loading ? 'در حال ثبت نام...' : 'ثبت نام' }}
          </b-button>

          <div class="text-center mt-3">
            <small>
              حساب کاربری دارید؟
              <nuxt-link to="/login">وارد شوید</nuxt-link>
            </small>
          </div>
        </b-form>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'

export default {
  name: 'RegisterPage',
  middleware: 'guest',
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: ''
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
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    async handleRegister() {
      this.$v.form.$touch()
      if (this.$v.form.$invalid) {
        return
      }

      this.loading = true
      this.error = ''

      try {
        await this.$store.dispatch('signup', {
          email: this.form.email,
          password: this.form.password
        })

        this.$bvToast.toast('ثبت نام با موفقیت انجام شد', {
          title: 'موفق',
          variant: 'success',
          solid: true
        })

        this.$router.push('/dashboard')
      } catch (error) {
        console.error('Register error:', error)
        
        switch (error.code) {
          case 'auth/email-already-in-use':
            this.error = 'این ایمیل قبلاً ثبت شده است'
            break
          case 'auth/invalid-email':
            this.error = 'فرمت ایمیل نامعتبر است'
            break
          case 'auth/weak-password':
            this.error = 'رمز عبور ضعیف است'
            break
          default:
            this.error = error.message || 'خطا در ثبت نام'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>