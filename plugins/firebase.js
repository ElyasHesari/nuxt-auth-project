import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default ({ $config }, inject) => {
  const firebaseConfig = {
    apiKey: $config.firebaseApiKey,
    authDomain: $config.firebaseAuthDomain,
    projectId: $config.firebaseProjectId,
    storageBucket: $config.firebaseStorageBucket,
    messagingSenderId: $config.firebaseMessagingSenderId,
    appId: $config.firebaseAppId
  }

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)

  inject('firebaseAuth', auth)
}