document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const nameSelect = document.getElementById("nameSelect");
  const totalAmount = document.getElementById("totalAmount");
  const transactionList = document.getElementById("transactionList");
  const ctx = document.getElementById("transactionChart").getContext("2d");
  let transactionChart;

  // Initialize theme (default to dark mode)
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.body.classList.add(`${currentTheme}-mode`);
  themeToggle.textContent = currentTheme === "light" ? "🌙" : "☀️";

  // Toggle theme
  themeToggle.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode", !isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    themeToggle.textContent = isDarkMode ? "☀️" : "🌙";
  });

  // Fetch all names and populate the dropdown
  fetch("/api/tasks")
    .then((response) => response.json())
    .then((data) => {
      const uniqueNames = [...new Set(data.map((item) => item.name))];
      uniqueNames.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        nameSelect.appendChild(option);
      });
    })
    .catch((error) => console.error("Error fetching names:", error));

  // Create or update the chart
  function updateChart(data) {
    const descriptions = data.map((item) => item.TransactionDescription);
    const amounts = data.map((item) => item.Amt);

    // Create a gradient for the bars
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(75, 192, 192, 1)");
    gradient.addColorStop(1, "rgba(153, 102, 255, 0.8)");

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
            backgroundColor: gradient,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Transaction Summary" },
        },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  // Event listener for dropdown change
  nameSelect.addEventListener("change", () => {
    const selectedName = nameSelect.value;

    if (selectedName) {
      fetch(`/api/tasks?name=${selectedName}`)
        .then((response) => response.json())
        .then((data) => {
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
        })
        .catch((error) =>
          console.error("Error fetching filtered data:", error)
        );
    }
  });
});
