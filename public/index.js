const eventSource = new EventSource('/api')

const priceDisplay = document.getElementById('price-display')

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    const eur = data.eur
    priceDisplay.textContent = eur
}

eventSource.onerror = () => {
      console.log("Connection lost. Attempting to reconnect...")

}