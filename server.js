const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const cors = require('cors');
const pr = require('./routes/ProduitRoutes'); // Adjust path as necessary
const carts = require('./routes/carts'); // Adjust path as necessary


dotenv.config();

const app = express();
app.use(cors())

const corsOptions = {
  origin: 'http://localhost:3000', // Allow only this origin (your frontend URL)
  optionsSuccessStatus: 200, // Some browsers (e.g., older IE versions) may need this status code
};

app.use(cors(corsOptions));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>  {})
  .catch((err) => console.error('MongoDB connection error:', err));

app.use("/api/auth", authRoutes);
app.use('/api/products', pr);
app.use('/uploads', express.static('public/uploads'));  // Serve static files from 'public/uploads'
app.use('/api/carts', carts);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {});