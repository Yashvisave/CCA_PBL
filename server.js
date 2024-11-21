const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS to allow the frontend to communicate with the backend
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Route to handle form submission
app.post("/add-playlist", (req, res) => {
  const { playlistName, trackId, visibility } = req.body;

  // Input validation
  if (!playlistName || !trackId || !visibility) {
    return res.status(400).send("All fields are required.");
  }

  // Log received data (for debugging purposes)
  console.log("Received Data:", { playlistName, trackId, visibility });

  // Terraform command to execute (customize this to your needs)
  const terraformCommand = `
    terraform apply -var 'playlist_name=${playlistName}' -var 'track_id=${trackId}' -var 'visibility=${visibility}' -auto-approve
  `;

  // Execute Terraform command
  exec(terraformCommand, (error, stdout, stderr) => {
    if (error) {
      console.error("Error executing Terraform:", stderr);
      return res.status(500).send("Error executing Terraform script.");
    }
    console.log("Terraform Output:", stdout);
    res.send("Playlist created successfully!");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
