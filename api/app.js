const http = require('http')
const express = require('express')
const app = express()
const expressStaticGzip = require('express-static-gzip')
const server = new http.Server(app)

app.use('/', expressStaticGzip(__dirname + '/dist', {
  enableBrotli: true
}))
app.use('/', express.static(__dirname + '/dist'))

require('zone.js/dist/zone-node')
require('reflect-metadata')
const ngExpressEngine = require('@nguniversal/express-engine').ngExpressEngine
const { enableProdMode } = require('@angular/core')

enableProdMode()

const {
  ServerAppModuleNgFactory,
  LAZY_MODULE_MAP
} = require('./dist-server/main.bundle')

const {
  provideModuleMap
} = require('@nguniversal/module-map-ngfactory-loader')

const provider = provideModuleMap(LAZY_MODULE_MAP)

app.engine(
  'html',
  ngExpressEngine({
    bootstrap: ServerAppModuleNgFactory,
    providers: [provider]
  })
)

app.set('view engine', 'html')
app.set('views', 'dist')

app.get('*', (req, res) => {
    res.render('index', {req, res})
})

server.listen(process.env.PORT || 7070, function () {
  console.log('listening on', server.address().port)
})