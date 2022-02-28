const express = require("express");
const cors = require("cors");
const { createUsers } = require("./src/users");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(cors());

app.post("/users", createUsers);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
