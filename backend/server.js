const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/routes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const corsOption = {
    origin: '*',
    credential: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOption))
app.use('/', router)

const port = 4000
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


