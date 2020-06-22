const express = require('express')
const app = express()
app.get('/add', (req, res) => {
  res.end('add')
})
app.listen(3000, () => {
  console.log('start')
})