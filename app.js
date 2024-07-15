const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const home = require("./routes/home")
require('dotenv').config();

const app = express();

// CONNECT TO DB
connectDB();

// MIDDLEWARE
app.use(cors({ origin: "https://real-estate-react-app-backend.vercel.app", credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());


// ROUTES

app.use("/", home)
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
