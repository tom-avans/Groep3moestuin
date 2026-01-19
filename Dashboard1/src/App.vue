<script setup>
import { ref } from 'vue'

  const menuItems = ref([
  { title: 'Dashboard', to: '/' },
  { title: 'Planten beheer', to: '/plantbeheer' },
  { title: 'Toren beheer', to: '/Torenbeheer' }, // Pas aan als je deze pagina hebt
  { title: 'Toren data', to: '/Torendata' },   // Pas aan als je deze pagina hebt
  { title: 'Contact', to: '/contact' },       // Pas aan als je deze pagina hebt
])
</script>

<template>
  
  <v-app> 
    <v-layout>

      <v-app-bar color="green" density="compact">
          <v-app-bar-title>Moestuin</v-app-bar-title>
          <v-btn 
            v-for="item in menuItems" 
            :key="item.title" 
            :to="item.to"
            variant="text"
          >
            {{ item.title }}
          </v-btn>
        </v-app-bar>

        <v-main>
          <router-view />
        </v-main>    
    </v-layout>    
  </v-app>
  
</template>

<style scoped></style>