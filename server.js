
const express = require('express')
const app = express()
const path = require('path')
const request = require('request')

app.use('/public', express.static(__dirname + '/public'))
app.set('views', __dirname + '/public/views')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

app.get('/', (req, res) => {
  request('http://www.google.com', (error, response, body) => {
      if(error)
        res.render('index.html', {data: error})
        
      res.render('index.html', {data: body})
  })
})

app.get('/draw', (req, res) => {
  res.render  ('draw.html')
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})

