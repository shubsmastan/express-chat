const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config(path.resolve(__dirname, "../.env"));

mongoose.set("strictQuery", false);
(async function () {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.log(error);
  }
})();

const PORT: string | number = process.env.PORT || 3030;

const app = express();

app.post("/signup", (req: Request, res: Response) => {});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
