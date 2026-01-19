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
  <div>
    <table>
      <tr>
        <th>Goedemorgen</th>
      </tr>
      <tr>
        <td></td>
      </tr>
    </table>
  </div>
</template>