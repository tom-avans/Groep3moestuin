<script> 
export default {
    data() {
      return {
        sensorData: 
        {
            temp: '-',
            ph: '-',
            licht: '-',
            waterpresent: '-',
            waterstroom: '-'
        }   
      };
    },
    methods: {
        async refreshClickHandler () 
        {
          try { 
            const response = await fetch('https://moestuingroep3.dedyn.io/getsensordata');
            if (!response.ok) throw new Error('Fout bij verbinden server');

            const data = await response.json();
            console.log(data);
            const payload = data[0];

            this.sensorData.temp = payload.temp;
            this.sensorData.ph = payload.pH;
            this.sensorData.licht = payload.licht;
            this.sensorData.waterPresent = payload.waterPresent ? 'Ja' : 'Nee';
            this.sensorData.waterstroom = payload.waterstroom;

          } catch (error) {
            console.error('Error fetching Sensor data:', error);
            alert('Fout bij het ophalen van sensordata');
          }  
        }
    }
  };
  </script>


<template>
    <h1>Live Sensor Data</h1>
    
    <v-btn class="ma-8" color="primary" @click="refreshClickHandler">Update gegevens</v-btn>

    <hr>

    <v-card class="sensor-card ma-4" width="400">
      <v-card-title class="text-h5 bg-grey-lighten-4">
        Waterkwaliteit
      </v-card-title>
      
      <v-card-text class="pt-4">
        <v-row class="mb-2">
            <v-col cols="6" class="font-weight-bold">Temperatuur:</v-col>
            <v-col cols="6" class="text-right text-blue">{{ sensorData.temp }} °C</v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row class="my-2">
            <v-col cols="6" class="font-weight-bold">pH Waarde:</v-col>
            <v-col cols="6" class="text-right">{{ sensorData.ph }}</v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row class="my-2">
            <v-col cols="6" class="font-weight-bold">Licht:</v-col>
            <v-col cols="6" class="text-right">{{ sensorData.licht }}</v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row class="my-2">
            <v-col cols="6" class="font-weight-bold">Waterstroom:</v-col>
            <v-col cols="6" class="text-right">{{ sensorData.waterstroom }}</v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row class="mt-2">
            <v-col cols="6" class="font-weight-bold">Water aanwezig:</v-col>
            <v-col cols="6" class="text-right" :class="sensorData.waterPresent === 'Ja' ? 'text-green' : 'text-red'">
                {{ sensorData.waterPresent }}
            </v-col>
        </v-row>

      </v-card-text>
    </v-card>
</template>
  
    
<style scoped>
  .sensor-card {
    border: 1px solid #e0e0e0;
  }
</style>