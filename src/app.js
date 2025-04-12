const express = require('express')
const app = express()
const cors = require('cors')
const superAdmin = require('./config/superAdmin')

app.use(express.json())
app.use(cors())

app.use('/api', require('./routes/index'))

app.use(require('./middlewares/PageNotFoundMiddleware'))
app.use(require('./middlewares/errorHendlerMiddleware'))

// superAdmin()

module.exports = app