document.addEventListener("DOMContentLoaded", () => {
  const nameSelect = document.getElementById("nameSelect");
  const totalAmount = document.getElementById("totalAmount");
  const transactionList = document.getElementById("transactionList");
  const ctx = document.getElementById("transactionChart").getContext("2d");
  let transactionChart;

  // Fetch all names and populate the dropdown
  const populateDropdown = async () => {
    try {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      console.log("Fetched Data:", data);

      const uniqueNames = [...new Set(data.map((item) => item.name))];
      if (uniqueNames.length === 0) {
        console.error("No unique names found!");
        return;
      }

      uniqueNames.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        nameSelect.appendChild(option);
      });
      console.log("Dropdown populated successfully.");
    } catch (error) {
      console.error("Error fetching names:", error);
    }
  };

  // Ensure touch compatibility for mobile
  nameSelect.addEventListener("touchstart", () => {
    nameSelect.focus();
  });

  // Populate the dropdown
  populateDropdown();

  // Create or update the chart
  function updateChart(data) {
    const descriptions = data.map((item) => item.TransactionDescription);
    const amounts = data.map((item) => item.Amt);

    if (transactionChart) {
      transactionChart.destroy();
    }

    transactionChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: descriptions,
        datasets: [
          {
            label: "Transaction Amount",
            data: amounts,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Transaction Summary",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Event listener for dropdown change
  nameSelect.addEventListener("change", async () => {
    const selectedName = nameSelect.value;

    if (selectedName) {
      try {
        const response = await fetch(`/api/tasks?name=${selectedName}`);
        const data = await response.json();
        console.log("Filtered Data:", data);

        // Calculate total amount
        const total = data.reduce((sum, item) => sum + item.Amt, 0);
        totalAmount.textContent = total;

        // Populate transaction list
        transactionList.innerHTML = "";
        data.forEach((item) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${item.TransactionDescription}: ${item.Amt}`;
          transactionList.appendChild(listItem);
        });

        // Update the chart
        updateChart(data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    }
  });
});
