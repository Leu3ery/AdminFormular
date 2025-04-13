const config = require('./config/config')
const app = require('./app')
const {sequelize} = require('./models/index')
const superAdmin = require('./config/superAdmin')

sequelize.sync().then(() => {
    app.listen(config.PORT || 3000, () => {
        // superAdmin()
        console.log('Server runs...')
    })
})