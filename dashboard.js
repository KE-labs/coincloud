 // Ensure the DOM is loaded before executing the script
 window.addEventListener("load", async () => {
    // Check for an Ethereum provider (e.g., MetaMask)
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access");
        return;
      }
    } else {
      alert("Non-Ethereum browser detected. Please install MetaMask.");
      return;
    }
    
    // Get the current account
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    document.getElementById("userAddress").textContent = account;
    
    // Function to update the live balance
    async function updateBalance() {
      try {
        const balanceWei = await web3.eth.getBalance(account);
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");
        document.getElementById("balanceValue").textContent = balanceEth + " ETH";
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    }
    
    // Update balance initially and every 10 seconds
    updateBalance();
    setInterval(updateBalance, 10000);
    
    // Deposit functionality
    document.getElementById("depositButton").addEventListener("click", async () => {
      const depositAmount = document.getElementById("depositAmount").value;
      if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
        alert("Please enter a valid deposit amount.");
        return;
      }
      const depositAmountWei = web3.utils.toWei(depositAmount, "ether");
      
      // Replace with your actual deposit address
      const depositAddress = "0xYourDepositAddressHere";
      
      try {
        web3.eth
          .sendTransaction({
            from: account,
            to: depositAddress,
            value: depositAmountWei,
          })
          .on("transactionHash", function (hash) {
            console.log("Transaction sent: ", hash);
            alert("Deposit transaction sent: " + hash);
          })
          .on("receipt", function (receipt) {
            console.log("Deposit successful:", receipt);
            alert("Deposit successful!");
            updateBalance(); // Update balance after deposit
          })
          .on("error", function (error) {
            console.error("Deposit error: ", error);
            alert("Deposit failed: " + error.message);
          });
      } catch (error) {
        console.error("Error during deposit:", error);
        alert("Deposit failed: " + error.message);
      }
    });
  });