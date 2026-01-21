import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useSensorLogic() {
  const lastUpdateTime = ref('-')
  const loading = ref(false)
  const sensorData = ref({
    temp: '-', ph: '-', licht: '-', waterPresent: false, waterstroom: '-'
  })
  const history = ref({
    labels: [], temp: [], ph: [], licht: [], stroom: []
  })

  const updateCurrentStatus = (item) => {
    sensorData.value.temp = item.temp
    sensorData.value.ph = item.pH
    sensorData.value.licht = item.licht
    sensorData.value.waterPresent = item.waterPresent
    sensorData.value.waterstroom = item.waterstroom
    lastUpdateTime.value = item.time
  }

  const addToHistory = (item) => {
    const timeLabel = new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    history.value.labels.push(timeLabel)
    history.value.temp.push(item.temp)
    history.value.ph.push(item.pH)
    history.value.licht.push(item.licht)
    history.value.stroom.push(item.waterstroom)

    // Beperk tot de laatste 12 metingen
    if (history.value.labels.length > 12) {
      history.value.labels.shift(); history.value.temp.shift(); 
      history.value.ph.shift(); history.value.licht.shift(); history.value.stroom.shift()
    }
  }

  const fetchData = async () => {
    loading.value = true
    try {
      const response = await fetch('https://moestuingroep3.dedyn.io/getsensordata')
      const data = await response.json()
      
      if (Array.isArray(data)) {
        const reversed = [...data].reverse()
        reversed.forEach(item => addToHistory(item))
        updateCurrentStatus(reversed[reversed.length - 1])
      } else {
        addToHistory(data)
        updateCurrentStatus(data)
      }
    } catch (e) { 
      console.error('Data fetch error:', e) 
    } finally {
      loading.value = false
    }
  }

  let polling = null
  onMounted(() => {
    fetchData()
    polling = setInterval(fetchData, 600000) // Elke 10 minuten
  })
  onBeforeUnmount(() => {
    if (polling) clearInterval(polling)
  })

  return { sensorData, history, lastUpdateTime, loading }
}