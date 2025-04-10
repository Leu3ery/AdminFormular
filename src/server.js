const config = require('./config/config')
const app = require('./app')
const {sequelize} = require('./models/index')

sequelize.sync().then(() => {
    app.listen(config.PORT || 3000, () => {
        console.log('Server runs...')
    })
})