const config = require('./config/config')
const app = require('./app')

app.listen(config.PORT || 3000, () => {
    console.log('Server runs...')
})