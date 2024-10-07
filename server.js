require('dotenv').config()
const http = require('http');
const app = require("./src/index")
const port = process.env.DEVELOPMENT_PORT || 4002
const server = http.createServer(app);
const cron = require("./src/controller/cron/cron");
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err)
    process.exit(1) 
})
server.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`)
})