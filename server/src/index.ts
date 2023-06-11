const express = require("express");

const app = express();

const PORT: string | number = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
