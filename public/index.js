const eventSource = new EventSource("/api");

const priceDisplay = document.getElementById("price-display");
const connectionStatus = document.getElementById("connection-status");
const investmentAmount = document.getElementById("investment-amount");
const dialog = document.getElementById("my-dialog");

document
  .getElementById("investment-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const amount = parseFloat(investmentAmount.value)
    const livePrice = parseFloat(priceDisplay.textContent)


    if (isNaN(amount) || amount <= 0) {
      alert("Please give an acceptable value")
      return
    }

    if (!livePrice || isNaN(livePrice) || livePrice <= 0) {
      alert("Live value is not retrieved, please wait...")
      return
    }

    const ounce = (amount / livePrice).toFixed(2)
    console.log("you bought", ounce)
    document.getElementById('investment-summary').textContent = ounce
    document.getElementById('total-amount').textContent = amount
    dialog.showModal()

    //write invoice to purchases.txt 
    try{
      const response = await fetch("/api/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount, price: livePrice, ounce })
      })
      const data = await response.json()
      console.log(data.message)
    }
    catch(err){
      console.error('Error creating invoice'. err)
    }

  });

  //close dialog
  document.getElementById('close-dialog-btn').addEventListener('click', () => {
    dialog.close()
    investmentAmount.value = ''
  })



eventSource.onopen = () => {
  connectionStatus.textContent = "Live Price 🟢";
  console.log("SSE connection opened");
};

eventSource.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    const eur = data.eur;
    priceDisplay.textContent = eur;
  } catch (err) {
    console.error("Invalid SSE message", err);
  }
};
eventSource.onerror = () => {
  console.log("Connection lost. Attempting to reconnect...");
  connectionStatus.textContent = "Disconnected 🔴";
};
