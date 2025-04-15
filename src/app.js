const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.use('/public', express.static('./public'))
app.use('/api', require('./routes/index'))

app.use(require('./middlewares/PageNotFoundMiddleware'))
app.use(require('./middlewares/errorHendlerMiddleware'))

module.exports = app