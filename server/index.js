require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PORT } = process.env;
const {
  login,
  logout,
  createUser,
  getUser,
} = require("./controllers/userCtrl");
const { createPet, getPetInfo, getUsersPets, storePetInfoID, resetPet } = require("./controllers/petCtrl");
const { addFriend, removeFriend } = require("./controllers/packCtrl");
const { updateStatus } = require("./controllers/statusCtrl");
const { seedData } = require("./controllers/dbCtrl");

const app = express();

app.use(express.json());
app.use(cors());

app.post("/data/seed", seedData);

app.get("/user/", getUser);
app.post("/user/create", createUser);
app.post("/user/login", login);
app.delete("/user/logout", logout, resetPet);

app.get("/pets", getUsersPets);
app.get("/pet", getPetInfo);
app.post("/pet/create", createPet);
app.post("/pet/:id", storePetInfoID)

app.put("/status/update", updateStatus);

app.post("/wolfpack/add/:id", addFriend);
app.delete("/wolfpack/remove/:id", removeFriend);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));