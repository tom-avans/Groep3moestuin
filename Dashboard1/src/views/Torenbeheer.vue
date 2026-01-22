<template>
  <v-container class="mt-5">
    <v-row>
      <v-col cols="12" md="6">
        <h2 class="text-h5 mb-4">Toren toevoegen</h2>
        
        <div class="mb-4">
          <label class="text-subtitle-2">Toren naam:</label>
          <v-text-field
            v-model="form.name"
            placeholder="Typ tekst"
            variant="outlined"
            density="compact"
            hide-details
          ></v-text-field>
        </div>

        <div class="mb-4">
          <v-text-field
            v-model.number="form.vakken"
            label="Aantal vakken per verdieping"
            type="number"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-layers-outline"
          ></v-text-field>
        </div>

        <div class="mb-6">
          <v-text-field
            v-model.number="form.verdiepingen"
            label="Aantal verdiepingen"
            type="number"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-home-floor-3"
          ></v-text-field>
        </div>

        <v-btn 
          color="grey-lighten-3" 
          class="text-none border shadow-sm"
          @click="submitTower"
        >
          Toren toevoegen
        </v-btn>
      </v-col>

      <v-col cols="12" md="4" offset-md="1">
        <v-table class="border rounded shadow-sm" density="comfortable">
          <thead>
            <tr>
              <th class="bg-grey-lighten-4 font-weight-bold">Toren</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="toren in towersList" 
              :key="toren.id"
              @click="selectedTorenId = toren.id"
              :class="{ 'bg-blue-lighten-5': selectedTorenId === toren.id }"
              style="cursor: pointer"
            >
              <td>{{ toren.name }}</td>
            </tr>
            <tr v-if="towersList.length === 0">
              <td class="text-grey text-center">Geen torens gevonden</td>
            </tr>
          </tbody>
        </v-table>

        <v-btn 
          class="mt-4 text-none border shadow-sm" 
          color="grey-lighten-3"
          :disabled="!selectedTorenId"
          @click="removeTower"
        >
          Toren verwijderen
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { torenData } from '../data/torenData'; // Updated path

// Reactive Data
const towersList = ref([]);
const selectedTorenId = ref(null);
const form = ref({
  name: '',
  vakken: 1,
  verdiepingen: 3
});

// Load existing towers on page load
onMounted(() => {
  towersList.value = torenData.getTowers();
});

// Create
const submitTower = () => {
  if (!form.value.name) return;
  
  towersList.value = torenData.addTower({ ...form.value });
  form.value.name = ''; // Reset name input
};

// Delete
const removeTower = () => {
  if (selectedTorenId.value) {
    towersList.value = torenData.deleteTower(selectedTorenId.value);
    selectedTorenId.value = null;
  }
};
</script>

<style scoped>
/* Matching the 'flat' look of the wireframe */
.v-btn {
  text-transform: none;
  letter-spacing: normal;
}
.border {
  border: 1px solid #ccc !important;
}
</style>