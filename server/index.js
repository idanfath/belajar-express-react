const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const db = require("./models");
const datasiswaRouter = require("./Routes/Artikels");

app.use("/api", datasiswaRouter);

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Server berjalan pada port 3001");
  });
});
