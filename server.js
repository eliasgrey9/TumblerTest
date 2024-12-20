const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the public directory
app.use(express.static("public"));

// Special handling for .obj files
app.get("**/*.obj", (req, res) => {
	const filePath = path.join(__dirname, "public", req.path);
	console.log("Attempting to serve:", filePath);
	console.log("Request path:", req.path);

	if (!require("fs").existsSync(filePath)) {
		console.log("File does not exist at:", filePath);
		return res.status(404).send("File not found");
	}

	res.setHeader("Content-Type", "text/plain");
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Methods", "GET");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.sendFile(filePath);
});

// For all other routes, serve index.html
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
