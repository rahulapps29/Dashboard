const express = require("express");
const cors = require("cors");
const axios = require("axios"); // To fetch data from the external API

const app = express();
const port = 4019;
const path = require("path");
// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));
// Middleware
app.use(cors());
app.use(express.json());

// Fetch data from the external API
const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://leger.rahulluthra.in/api/tasks/d"
    );
    return response.data.tasks;
  } catch (error) {
    console.error("Error fetching data from API:", error.message);
    return [];
  }
};

// API endpoint to get tasks
app.get("/api/tasks", async (req, res) => {
  const { name } = req.query;

  // Fetch data from the external API
  const data = await fetchData();

  if (name) {
    const filteredData = data.filter(
      (item) => item.name && item.name.toLowerCase() === name.toLowerCase()
    );
    return res.json(filteredData);
  }

  res.json(data);
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://<your-local-ip>:${port}`);
});
