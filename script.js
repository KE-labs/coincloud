document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true";
    let chartInstances = {}; // Store chart instances to update later

    function getStoredData() {
        let storedData = localStorage.getItem("cryptoData");
        return storedData ? JSON.parse(storedData) : null;
    }

    function saveDataToStorage(data) {
        localStorage.setItem("cryptoData", JSON.stringify(data));
    }

    async function fetchCryptoData() {
        try {
            let response = await fetch(API_URL);
            let data = await response.json();
            saveDataToStorage(data); // Save latest data
            updateTable(data);
        } catch (error) {
            console.error("Network error, loading cached data:", error);
            let cachedData = getStoredData();
            if (cachedData) {
                updateTable(cachedData); // Load old data if available
            }
        }
    }

    function updateTable(data) {
        let tableBody = document.querySelector("#cryptoTable tbody");

        if (tableBody.children.length === 0) {
            // First-time rendering
            tableBody.innerHTML = ""; // Clear previous entries
            data.forEach(coin => {
                let row = document.createElement("tr");
                row.setAttribute("data-id", coin.id); // Store coin ID for easy updating

                row.innerHTML = `
                    <td><img src="${coin.image}" alt="${coin.name}"></td>
                    <td>${coin.name}</td>
                    <td>${coin.symbol.toUpperCase()}</td>
                    <td class="price" id="price-${coin.id}">$${coin.current_price.toLocaleString()}</td>
                    <td class="change" id="change-${coin.id}">${formatChange(coin.price_change_percentage_24h)}</td>
                    <td><canvas id="chart-${coin.id}"></canvas></td>
                `;

                tableBody.appendChild(row);
                renderMiniChart(`chart-${coin.id}`, coin.sparkline_in_7d.price, coin.id);
            });
        } else {
            // Update prices and 24h change
            data.forEach(coin => {
                let priceElement = document.getElementById(`price-${coin.id}`);
                let changeElement = document.getElementById(`change-${coin.id}`);

                if (priceElement) priceElement.innerHTML = `$${coin.current_price.toLocaleString()}`;
                if (changeElement) changeElement.innerHTML = formatChange(coin.price_change_percentage_24h);

                updateChart(coin.id, coin.sparkline_in_7d.price);
            });
        }
    }

    function formatChange(priceChange) {
        let color = priceChange >= 0 ? "green" : "red";
        return `<span style="color:${color};">${priceChange.toFixed(2)}%</span>`;
    }

    function renderMiniChart(canvasId, priceData, coinId) {
        let ctx = document.getElementById(canvasId).getContext("2d");

        chartInstances[coinId] = new Chart(ctx, {
            type: "line",
            data: {
                labels: Array(priceData.length).fill(""),
                datasets: [{
                    data: priceData,
                    borderColor: "#4CAF50",
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false,
                }]
            },
            options: {
                responsive: false,
                scales: { x: { display: false }, y: { display: false } },
                elements: { line: { tension: 0.3 } },
                plugins: { legend: { display: false } }
            }
        });
    }

    function updateChart(coinId, newPriceData) {
        let chart = chartInstances[coinId];
        if (chart) {
            chart.data.datasets[0].data = newPriceData;
            chart.update();
        }
    }

    // Load stored data immediately if available
    let cachedData = getStoredData();
    if (cachedData) updateTable(cachedData);

    // Fetch crypto data initially and every 10 seconds
    fetchCryptoData();
    setInterval(fetchCryptoData, 10000);
});


async function fetchCryptoData() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,solana&vs_currencies=usd&include_24hr_change=true&localization=false');
      const data = await response.json();

      // Update Bitcoin
      const btcData = data.bitcoin;
      const btcPrice = `USD ${btcData.usd.toFixed(2)}`;
      document.getElementById("btc-price").textContent = btcPrice;
      document.getElementById("btc-current-price").textContent = btcData.usd.toFixed(2);
      document.getElementById("btc-change").textContent = `${(btcData.usd_24h_change).toFixed(2)}%`;
      document.getElementById("btc-logo").src = `https://assets.coingecko.com/coins/images/1/large/bitcoin.png`;

      // Save the data in localStorage
      localStorage.setItem("btc-logo", "https://assets.coingecko.com/coins/images/1/large/bitcoin.png");
      localStorage.setItem("btc-price", btcPrice);
      localStorage.setItem("btc-change", `${(btcData.usd_24h_change).toFixed(2)}%`);

      // Update Ethereum
      const ethData = data.ethereum;
      const ethPrice = `USD ${ethData.usd.toFixed(2)}`;
      document.getElementById("eth-price").textContent = ethPrice;
      document.getElementById("eth-current-price").textContent = ethData.usd.toFixed(2);
      document.getElementById("eth-change").textContent = `${(ethData.usd_24h_change).toFixed(2)}%`;
      document.getElementById("eth-logo").src = `https://assets.coingecko.com/coins/images/279/large/ethereum.png`;

      // Save the data in localStorage
      localStorage.setItem("eth-logo", "https://assets.coingecko.com/coins/images/279/large/ethereum.png");
      localStorage.setItem("eth-price", ethPrice);
      localStorage.setItem("eth-change", `${(ethData.usd_24h_change).toFixed(2)}%`);

      // Update XRP
      const xrpData = data.ripple;
      const xrpPrice = `USD ${xrpData.usd.toFixed(2)}`;
      document.getElementById("xrp-price").textContent = xrpPrice;
      document.getElementById("xrp-current-price").textContent = xrpData.usd.toFixed(2);
      document.getElementById("xrp-change").textContent = `${(xrpData.usd_24h_change).toFixed(2)}%`;
      document.getElementById("xrp-logo").src = `https://assets.coingecko.com/coins/images/44/large/ripple.png`;

      // Save the data in localStorage
      localStorage.setItem("xrp-logo", "https://assets.coingecko.com/coins/images/44/large/ripple.png");
      localStorage.setItem("xrp-price", xrpPrice);
      localStorage.setItem("xrp-change", `${(xrpData.usd_24h_change).toFixed(2)}%`);

      // Update Solana
      const solData = data.solana;
      const solPrice = `USD ${solData.usd.toFixed(2)}`;
      document.getElementById("sol-price").textContent = solPrice;
      document.getElementById("sol-current-price").textContent = solData.usd.toFixed(2);
      document.getElementById("sol-change").textContent = `${(solData.usd_24h_change).toFixed(2)}%`;
      document.getElementById("sol-logo").src = `https://assets.coingecko.com/coins/images/4128/large/solana.png`;

      // Save the data in localStorage
      localStorage.setItem("sol-logo", "https://assets.coingecko.com/coins/images/4128/large/solana.png");
      localStorage.setItem("sol-price", solPrice);
      localStorage.setItem("sol-change", `${(solData.usd_24h_change).toFixed(2)}%`);

    } catch (error) {
      console.error("Error fetching data", error);
      // Fallback to last remembered data from localStorage if there's an error
      useLastKnownData();
    }
  }

  // Function to load data from localStorage if available
  function useLastKnownData() {
    // Load last saved data from localStorage
    const btcLogo = localStorage.getItem("btc-logo");
    const btcPrice = localStorage.getItem("btc-price");
    const btcChange = localStorage.getItem("btc-change");

    const ethLogo = localStorage.getItem("eth-logo");
    const ethPrice = localStorage.getItem("eth-price");
    const ethChange = localStorage.getItem("eth-change");

    const xrpLogo = localStorage.getItem("xrp-logo");
    const xrpPrice = localStorage.getItem("xrp-price");
    const xrpChange = localStorage.getItem("xrp-change");

    const solLogo = localStorage.getItem("sol-logo");
    const solPrice = localStorage.getItem("sol-price");
    const solChange = localStorage.getItem("sol-change");

    // Use the last known data if available
    if (btcLogo && btcPrice && btcChange) {
      document.getElementById("btc-logo").src = btcLogo;
      document.getElementById("btc-price").textContent = btcPrice;
      document.getElementById("btc-change").textContent = btcChange;
    }

    if (ethLogo && ethPrice && ethChange) {
      document.getElementById("eth-logo").src = ethLogo;
      document.getElementById("eth-price").textContent = ethPrice;
      document.getElementById("eth-change").textContent = ethChange;
    }

    if (xrpLogo && xrpPrice && xrpChange) {
      document.getElementById("xrp-logo").src = xrpLogo;
      document.getElementById("xrp-price").textContent = xrpPrice;
      document.getElementById("xrp-change").textContent = xrpChange;
    }

    if (solLogo && solPrice && solChange) {
      document.getElementById("sol-logo").src = solLogo;
      document.getElementById("sol-price").textContent = solPrice;
      document.getElementById("sol-change").textContent = solChange;
    }
  }

  // Fetch data initially
  fetchCryptoData();

  // Update data every 10 seconds
  setInterval(fetchCryptoData, 10000);

  const login = document.getElementById("login-btn");
  const loginPage = document.getElementById("login-page");
  const body = document.getElementById("body");
  const homepageBody = document.getElementById("homepage-body");
  const dashboardBody = document.getElementById("dashboard-body")
  
  login.addEventListener("click", () => {
      loginPage.classList.toggle("hide");
      homepageBody.classList.toggle("hide");
      body.classList.add("neutral")
  });
