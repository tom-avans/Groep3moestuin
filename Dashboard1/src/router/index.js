import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/Homeview.vue'
import Plantbeheer from '@/views/Plantbeheer.vue'
import Torenbeheer from '@/views/Torenbeheer.vue'
import Torendata from '@/views/Torendata.vue'
import Contact from '@/views/Contact.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/plantbeheer', component: Plantbeheer },
  { path: '/torenbeheer', component: Torenbeheer },
  { path: '/torendata', component: Torendata },
  { path: '/contact', component: Contact },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router