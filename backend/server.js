const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const dns = require("node:dns");

dotenv.config();

// DNS configuration for MongoDB SRV connection
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = require("./config/db");

connectDB();

const app = express();

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

// ===============================
// BODY PARSERS
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// UPLOADS
// ===============================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ===============================
// ROUTES
// ===============================

app.use("/api/auth", require("./routes/authRoutes"));

app.use(
  "/api/providers",
  require("./routes/providerRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

// ===============================
// HEALTH CHECK
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "Service Provider Portal API is running",
  });
});

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});