const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port=5000;
const dotenv = require("dotenv");
const userRoutes=require('./routes/user')
const cors=require('cors')
dotenv.config();
//connect to db
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("Mongodb connected failed", err));

app.use(cors())
app.use(express.json());
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
mongoose.connection.once("open", () => {
  console.log("Connected to DB:", mongoose.
    
    
    
    connection.name);
});
