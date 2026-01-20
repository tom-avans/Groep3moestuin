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

    <v-card class="mb-6 bg-grey-lighten-4" outlined, elevation="3">
      <v-card-text class="d-flex align-center">
        <div class="mr-4 font-weight-bold">Status Watersensor:</div>
        <div 
          :class="sensorData.waterPresent ? 'status-led-on' : 'status-led-off'"
          class="status-led"
        ></div>
        <span class="ml-3 font-weight-medium">
          {{ sensorData.waterPresent ? 'Water gedetecteerd' : 'Geen water aanwezig' }}
        </span>
      </v-card-text>
    </v-card>

    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="3">
          <v-card-title class="text-subtitle-1">Temperatuur (°C)</v-card-title>
          <div class="chart-container">
            <LineChart :data="getChartData('Temperatuur', history.temp, '#FF5252')" :options="chartOptions" :key="history.labels.length" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="3">
          <v-card-title class="text-subtitle-1">pH Waarde</v-card-title>
          <div class="chart-container">
            <LineChart :data="getChartData('pH', history.ph, '#4CAF50')" :options="chartOptions" :key="history.labels.length" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="3">
          <v-card-title class="text-subtitle-1">Lichtsterkte</v-card-title>
          <div class="chart-container">
            <LineChart :data="getChartData('Licht', history.licht, '#FFC107')" :options="chartOptions" :key="history.labels.length" />
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="3">
          <v-card-title class="text-subtitle-1">Waterstroom</v-card-title>
          <div class="chart-container">
            <LineChart :data="getChartData('Stroom', history.stroom, '#2196F3')" :options="chartOptions" :key="history.labels.length" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// --------------------------------------------------
// IMPORTS & CONFIGURATIE
// --------------------------------------------------
import { Line } from 'vue-chartjs'
import { 
  Chart as ChartJS, Title, Tooltip, Legend, LineElement, 
  CategoryScale, LinearScale, PointElement 
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

export default {
  name: 'SensorDashboard',
  components: { LineChart: Line },

  // --------------------------------------------------
  // DATA OPSLAG (STATE)
  // --------------------------------------------------
  data() {
    return {
      loading: false,
      polling: null,
      lastUpdateTime: '-',
      sensorData: {
        temp: '-',
        ph: '-',
        licht: '-',
        waterPresent: false,
        waterstroom: '-'
      },
      history: {
        labels: [],
        temp: [],
        ph: [],
        licht: [],
        stroom: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: false }
        }
      }
    };
  },

  // --------------------------------------------------
  // LOGICA & API FUNCTIES
  // --------------------------------------------------
  methods: {
    // FUNCTIE: Geschiedenis ophalen (Afgelopen uur)
    async fetchInitialData() {
        this.loading = true;
        try {
            const response = await fetch('https://moestuingroep3.dedyn.io/getsensordata');
            const data = (await response.json()).reverse();

            // We gaan ervan uit dat de API een lijst (array) teruggeeft.
            // Als er om de 10 min data is, zijn de laatste 6 items het afgelopen uur.
            if (Array.isArray(data)) {
                 // Pak de laatste 6 metingen
                
                data.forEach(item => {
                    this.addToHistory(item);
                });
                
                // Update de huidige status met het meest recente item
                const lastItem = data[data.length - 1];
                this.updateCurrentStatus(lastItem);
            } else {
                // Als de API geen lijst geeft maar 1 object, voeg dan alleen die toe
                this.addToHistory(data[0] || data);
                this.updateCurrentStatus(data[0] || data);
            }
        } catch (error) {
            console.error('Fout bij laden geschiedenis:', error);
        } finally {
            this.loading = false;
        }
    },

    // FUNCTIE: Enkele nieuwe meting ophalen (voor de interval)
    async refreshClickHandler() {
      this.loading = true;
      try {
        const response = await fetch('https://moestuingroep3.dedyn.io/getsensordata');
        const data = await response.json();
        const payload = Array.isArray(data) ? data[0] : data;

        this.updateCurrentStatus(payload);
        this.addToHistory(payload);

        // Limiet historie op 12 punten (2 uur aan data)
        if (this.history.labels.length > 12) {
          this.history.labels.shift();
          this.history.temp.shift();
          this.history.ph.shift();
          this.history.licht.shift();
          this.history.stroom.shift();
        }

      } catch (error) {
        console.error('Fout bij verversen:', error);
      } finally {
        this.loading = false;
      }
    },

    // HULPFUNCTIE: UI bijwerken
    updateCurrentStatus(item) {
        this.sensorData.temp = item.temp;
        this.sensorData.ph = item.pH;
        this.sensorData.licht = item.licht;
        this.sensorData.waterPresent = item.waterPresent;
        this.sensorData.waterstroom = item.waterstroom;
        this.lastUpdateTime = item.time;
    },

    // HULPFUNCTIE: Data toevoegen aan grafiek-arrays
    addToHistory(item) {
        const timeLabel = new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.history.labels.push(timeLabel);
        this.history.temp.push(item.temp);
        this.history.ph.push(item.pH);
        this.history.licht.push(item.licht);
        this.history.stroom.push(item.waterstroom);
    },

    // FUNCTIE: Data veilig koppelen aan de grafiek component
    getChartData(label, dataPoints, color) {
      return {
        labels: [...this.history.labels], 
        datasets: [{
          label: label,
          backgroundColor: color + '33', // 33 voegt transparantie toe
          borderColor: color,
          data: [...dataPoints],
          tension: 0.3,
          fill: true // Geeft een mooi ingevuld vlak onder de lijn
        }]
      }
    }
  },

  // --------------------------------------------------
  // AUTOMATISERING (LIFECYCLE)
  // --------------------------------------------------
  mounted() {
    // 1. Haal eerst de geschiedenis van het afgelopen uur op
    this.fetchInitialData();

    // 2. Start daarna de timer voor elke 10 minuten (600.000 ms)
    this.polling = setInterval(() => {
      this.refreshClickHandler();
    }, 600000);
  },
  beforeUnmount() {
    if (this.polling) {
      clearInterval(this.polling);
    }
  }
};
</script>

<style scoped>
/* --------------------------------------------------
   OPMAAK (CSS)
   -------------------------------------------------- */
.chart-container {
  height: 250px;
  padding: 15px;
}

.status-led {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.status-led-on {
  background-color: #4CAF50;
  box-shadow: 0 0 12px #4CAF50;
}

.status-led-off {
  background-color: #F44336;
  box-shadow: 0 0 8px #F44336;
}
</style>