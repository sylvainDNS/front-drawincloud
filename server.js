require('dotenv').config()

const express = require('express')
const app = express()
const path = require('path')
const request = require('request')

app.use('/public', express.static(__dirname + '/public'))
app.set('views', __dirname + '/public/views')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html')

const checkError = (error, body) => {
  if (error)
    return error

  return body
}

app.get('/', (req, res) => {
  request.get(process.env.IP + '/snapshot', (error, response, body) => {
    if (error) {
      res.send(error.code)
    } else {
      res.render('index.html', {
        data: body
      })
    }
  })
})

app.get('/draw', (req, res) => {
  res.render('draw.html')
})

app.get('/draw/:id', (req, res) => {
  const id = req.params.id
  request.get(process.env.IP + '/snapshot/' + id, (error, response, body) => {
    if (error) {
      res.send(error.code)
    } else {
      const data = JSON.parse(body)
      res.render('draw.html', {
        dataURL: data.dataURL,
        title: data.title
      })
    }
  })
})

app.listen(3000, () => {
  console.log('Front listening on port 3000')
})