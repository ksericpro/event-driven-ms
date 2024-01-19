const express = require("express")

const app = express()

const port = process.env.PORT || 8081;

const prefix = "sillyworld";

app.get(`/`, (req,res) => {
  res.send("alive");
})

app.get(`/${prefix}`, (req,res) => {
  res.send("This is the server's silly response…");
})

app.get(`/${prefix}/ping`, (req,res) => {
  res.send("ping");
})

app.listen(port,() => {
  console.log(`Listening@${prefix}:${port}`);
})