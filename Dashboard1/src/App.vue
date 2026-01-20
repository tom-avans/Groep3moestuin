<script setup>
import { ref } from 'vue'

  const menuItems = ref([
  { title: 'Dashboard', to: '/' },
  { title: 'Planten beheer', to: '/plantbeheer' },
  { title: 'Toren beheer', to: '/Torenbeheer' }, 
  { title: 'Toren data', to: '/Torendata' },   
  { title: 'Contact', to: '/contact' },       
])
</script>

<template>
  
  <v-app> 
    <v-layout>

      <v-app-bar color="green" density="compact">
          <v-app-bar-title>Moestuin groep 3</v-app-bar-title>
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