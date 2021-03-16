const express = require('express');

const path = require('path')
const app = express();
const fs = require('fs')

const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8').replace('{{JSON}}', JSON.stringify(require('./commands.json')))

app.get('*', (req, res) => {
  res.send(html)
})

app.listen(8081)
