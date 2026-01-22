<template>
  <v-container>
    <v-row align="center" justify="center">
      
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedTower"
          :items="towers"
          label="Toren kiezer"
          variant="outlined"
          density="comfortable"
          hide-details
        ></v-select>
      </v-col>
    </v-row>

    <v-divider class="my-6"></v-divider>

    <v-row justify="center" class="mb-8">
      <v-col cols="12" sm="4" md="2">
        <v-card elevation="3" class="pa-4">
          <v-card-title class="text-center text-h6 pb-4">
            Planten in {{ selectedTower }}
          </v-card-title>
          <div class="tower-grid-2x2">
            <div 
              v-for="(plant, index) in currentTowerPlants" 
              :key="index" 
              class="grid-cell"
            >
              <div v-if="plant !== 'X'" class="d-flex flex-column align-center">
                <v-icon color="success" size="24">mdi-leaf</v-icon>
                <span class="text-caption mt-1 font-weight-medium">{{ plant }}</span>
              </div>
              <v-icon v-else color="grey-lighten-2" size="large">mdi-close</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="mb-6 bg-grey-lighten-4" variant="outlined" elevation="3">
      <v-card-text class="d-flex align-center">
        <div class="mr-4 font-weight-bold">Status Watersensor:</div>
        <div :class="sensorData.waterPresent ? 'status-led-on' : 'status-led-off'" class="status-led"></div>
        <span class="ml-3 font-weight-medium">
          {{ sensorData.waterPresent ? 'Water gedetecteerd' : 'Geen water aanwezig' }}
        </span>
        <v-spacer></v-spacer>
        <span class="text-caption text-grey">Laatste update: {{ lastUpdateTime }}</span>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col v-for="chart in chartConfigs" :key="chart.title" cols="12" md="6">
        <v-card elevation="3">
          <v-card-title class="text-subtitle-1">{{ chart.title }}</v-card-title>
          <div class="chart-container">
            <LineChart 
              :data="createChartData(chart.label, chart.dataPoints, chart.color)" 
              :options="getChartOptions(chart.min, chart.max)" 
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
import { 
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, 
  CategoryScale, LinearScale, PointElement 
} from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { useSensorLogic } from '@/data/sensorData'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, annotationPlugin)

const { sensorData, history, lastUpdateTime } = useSensorLogic()

// Tower Selection Logic
const selectedTower = ref('Toren 1')
const towers = ['Toren 1', 'Toren 2', 'Toren 3']

// Plant data for 2x2 grids
const towerData = {
  'Toren 1': ['Basilicum', 'Munt', 'X', 'Peterselie'],
  'Toren 2': ['Rozemarijn', 'Lavendel', 'Thijm', 'Munt'],
  'Toren 3': ['X', 'X', 'Basilicum', 'X']
}

const currentTowerPlants = computed(() => towerData[selectedTower.value])

const chartConfigs = computed(() => [
  { title: 'Temperatuur (°C)', label: 'Temperatuur', dataPoints: history.value.temp, color: '#FF5252', min: 12, max: 25 },
  { title: 'pH Waarde', label: 'pH', dataPoints: history.value.ph, color: '#4CAF50', min: 6.0, max: 7 },
  { title: 'Lichtsterkte', label: 'Licht', dataPoints: history.value.licht, color: '#FFC107', min: 300, max: 900 },
  { title: 'Waterstroom', label: 'Stroom', dataPoints: history.value.stroom, color: '#2196F3', min: 200, max: 800 },
])

const getChartOptions = (minVal, maxVal) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    annotation: {
      annotations: {
        minLine: {
          type: 'line', yMin: minVal, yMax: minVal, borderColor: 'rgba(0, 0, 0, 0.4)', borderWidth: 2, borderDash: [5, 5],
          label: { display: true, content: `Min: ${minVal}`, position: 'end', backgroundColor: 'rgba(0,0,0,0.6)', font: { size: 10 } }
        },
        maxLine: {
          type: 'line', yMin: maxVal, yMax: maxVal, borderColor: 'rgba(0, 0, 0, 0.4)', borderWidth: 2, borderDash: [5, 5],
          label: { display: true, content: `Max: ${maxVal}`, position: 'end', backgroundColor: 'rgba(0,0,0,0.6)', font: { size: 10 } }
        }
      }
    }
  },
  scales: { y: { beginAtZero: false, grace: '10%' } }
})

const createChartData = (label, dataPoints, color) => ({
  labels: history.value.labels,
  datasets: [{
    label: label,
    backgroundColor: color + '33',
    borderColor: color,
    data: [...dataPoints],
    tension: 0.3,
    fill: true
  }]
})
</script>

<style scoped src="../stylesheets/dashboard.css"></style>