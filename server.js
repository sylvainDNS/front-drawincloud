
const express = require('express')
const app = express()
const path = require('path')
const request = require('request')

app.use('/public', express.static(__dirname + '/public'))
app.set('views', __dirname + '/public/views')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')
require('dotenv').config()

const checkError = (error, body) => {
      if(error)
        return error
      
      return body
}

app.get('/', (req, res) => {
  console.log(process.env.IP)
  request(process.env.IP + '/snapshot', (error, response, body) => {
    console.log('request', response.data)
      const data = checkError(error, body)
      res.render('index.html', {data: data})
  })
})

app.get('/draw', (req, res) => {
  res.render ('draw.html')
})

app.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})

