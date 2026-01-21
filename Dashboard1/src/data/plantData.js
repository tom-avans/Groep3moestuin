// src/data/plantData.js
import { ref } from 'vue';

// De lijst met alle mogelijke plantsoorten
export const plantSpecies = ref([
  'Basilicum',
  'Munt',
  'Oregano',
  'Salie',
  'Tijm'
]);

// De status van de torens (bijvoorbeeld welke vakjes bezet zijn)
// Dit kun je later makkelijk vervangen door een API-call naar je database
export const towerStatus = ref([
  { id: 1, slots: [{ id: 1, plant: 'Basilicum' }, { id: 2, plant: null }, { id: 3, plant: null }] },
  { id: 2, slots: [{ id: 1, plant: null }, { id: 2, plant: 'Munt' }, { id: 3, plant: null }] },
  { id: 3, slots: [{ id: 1, plant: null }, { id: 2, plant: null }, { id: 3, plant: 'Salie' }] },
]);