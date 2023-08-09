const connetToMongo = require('./db');
const express = require('express')
connetToMongo();
var cors = require('cors')

const app = express()
const port = 5000
app.use(cors())
app.use(express.json())

//Avaiable routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))



app.listen(port, () => {
  console.log(`iNoteBook backend listening at http://localhost:${port}`)
})
