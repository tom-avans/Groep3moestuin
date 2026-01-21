<template>
  <v-container>
    <v-row align="center">
      <v-col cols="auto">
        <h1>Live Sensor Data</h1>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <span class="text-caption text-grey">Laatste update: {{ lastUpdateTime }}</span>
      </v-col>
    </v-row>

    <v-divider class="mb-6"></v-divider>

    <v-card class="mb-6 bg-grey-lighten-4" variant="outlined" elevation="3">
      <v-card-text class="d-flex align-center">
        <div class="mr-4 font-weight-bold">Status Watersensor:</div>
        <div :class="sensorData.waterPresent ? 'status-led-on' : 'status-led-off'" class="status-led"></div>
        <span class="ml-3 font-weight-medium">
          {{ sensorData.waterPresent ? 'Water gedetecteerd' : 'Geen water aanwezig' }}
        </span>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col v-for="chart in chartConfigs" :key="chart.title" cols="12" md="6">
        <v-card elevation="3">
          <v-card-title class="text-subtitle-1">{{ chart.title }}</v-card-title>
          <div class="chart-container">
            <LineChart 
              :data="createChartData(chart.label, chart.dataPoints, chart.color)" 
              :options="chartOptions" 
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
import { 
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, 
  CategoryScale, LinearScale, PointElement 
} from 'chart.js'

// Importeer de logica uit het nieuwe pad
import { useSensorLogic } from '@/data/sensorData'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const { sensorData, history, lastUpdateTime } = useSensorLogic()

const chartOptions = { 
  responsive: true, 
  maintainAspectRatio: false 
}

const chartConfigs = computed(() => [
  { title: 'Temperatuur (°C)', label: 'Temperatuur', dataPoints: history.value.temp, color: '#FF5252' },
  { title: 'pH Waarde', label: 'pH', dataPoints: history.value.ph, color: '#4CAF50' },
  { title: 'Lichtsterkte', label: 'Licht', dataPoints: history.value.licht, color: '#FFC107' },
  { title: 'Waterstroom', label: 'Stroom', dataPoints: history.value.stroom, color: '#2196F3' },
])

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