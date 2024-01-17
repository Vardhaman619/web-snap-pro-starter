const express = require('express')
const app = express()
const http = require('http').createServer(app)
const path = require('path')

const PORT = 1337

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../client')))

http.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
