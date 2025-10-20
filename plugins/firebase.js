
export default ({ $config }, inject) => {
  const firebaseConfig = {
    apiKey: $config.firebaseApiKey,
    authDomain: $config.firebaseAuthDomain,
    projectId: $config.firebaseProjectId,
    storageBucket: $config.firebaseStorageBucket,
    messagingSenderId: $config.firebaseMessagingSenderId,
    appId: $config.firebaseAppId
  }

  inject('firebaseConfig', firebaseConfig)
}