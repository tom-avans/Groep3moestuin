import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Keycloak from 'keycloak-js'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

//1. Instellingen voor jouw Oracle Keycloak
const initOptions = {
  url: 'https://aaad02.avans.nl:8443/', // Jouw Oracle IP
  realm: 'MoestuinGroep3',             // De realm die je maakte
  clientId: 'VueClient',               // De client ID
  onLoad: 'login-required'           // Dwingt login af bij start
}


const vuetify = createVuetify({
  components,
  directives,
})

const keycloak = new Keycloak(initOptions);

// 2. Probeer te verbinden
keycloak.init({ onLoad: initOptions.onLoad }).then((auth) => {
  if (!auth) {
    window.location.reload();
  } else {
    console.log("Ingelogd!");

    // 3. Start de Vue app pas ALS we ingelogd zijn
    const app = createApp(App)
    // We maken keycloak beschikbaar in de hele app
    app.config.globalProperties.$keycloak = keycloak;
    app.mount('#app')
  }
}).catch(() => {
  console.error("Authenticatie mislukt");
});

const app = createApp(App)

app.use(router)
app.use(vuetify) // Voeg Vuetify toe aan je app

app.mount('#app')