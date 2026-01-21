<template>
  <v-container class="planten-beheer-container mt-10">
    <v-row>
      <v-col cols="12" md="8">
        
        <div class="action-group mb-12">
          <v-row dense>
            <v-col cols="4">
              <v-select 
                label="Plantsoort" 
                :items="plantSpecies" 
                variant="outlined" 
                density="compact" 
              />
            </v-col>
            <v-col cols="4">
              <v-select 
                label="Toren nummer" 
                :items="towerIds" 
                variant="outlined" 
                density="compact" 
              />
            </v-col>
            <v-col cols="4">
              <v-select label="Toren vak" :items="[1, 2, 3]" variant="outlined" density="compact" />
            </v-col>
          </v-row>
          <v-btn class="mt-2 text-none action-btn" variant="outlined">Plant toevoegen</v-btn>
        </div>

        <div class="action-group">
          <v-row dense>
            <v-col cols="4">
              <v-select label="Toren nummer" :items="towerIds" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="4">
              <v-select label="Toren vak" :items="[1, 2, 3]" variant="outlined" density="compact" />
            </v-col>
          </v-row>
          <v-btn class="mt-2 text-none action-btn" variant="outlined">Plant verwijderen</v-btn>
        </div>
      </v-col>

      <v-col cols="12" md="4" class="ps-md-10">
        <h2 class="list-title mb-4">Planten soorten</h2>
        <div class="species-list-container">
          <div v-for="plant in plantSpecies" :key="plant" class="species-item">
            {{ plant }}
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue';
import '@/stylesheets/plantbeheer.css';

// 1. Importeer de data uit je nieuwe bestand
import { plantSpecies, towerStatus } from '@/data/plantData';

// 2. Maak een handige lijst van alleen de toren-nummers voor de dropdowns
const towerIds = computed(() => towerStatus.value.map(t => t.id));
</script>