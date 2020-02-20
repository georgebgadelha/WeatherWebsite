const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = 8080

//Define paths for Express config
const publicDir = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Only necessary if the views folder is not named views, as it is called templates on this project
//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
//Setup static directory to serve
app.use(express.static(publicDir))
//
// app.use('/help', express.static(publicDir + '/help.html'))
//
// app.use('/about', express.static(publicDir + '/about.html'))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'George Gadelha'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'George Gadelha'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    helpText: 'This is some helpful text',
    name: 'George Gadelha'
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address!'
    })
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) return res.send({ error })
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) return res.send({ error })
      return res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  })
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term!'
    })
  }
  console.log(req.query);
  res.send({
    produts: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'George Gadelha',
    errorMessage: 'Help article not found'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'George Gadelha',
    errorMessage: 'Page not found'
  })
})

app.listen(port, () => {
  console.log('Server is up on port', port);
})
