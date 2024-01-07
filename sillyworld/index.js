const express = require("express")

const app = express()

const port = process.env.PORT || 8081;

app.get("/", (req,res) => {
  res.send("This is the server's silly response…")
})

app.listen(port,() => {
  console.log(`Listening@${port}`);
})