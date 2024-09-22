require("dotenv").config()
const http = require("http")
const { dbConnect } = require("./services/db")


const app = require("./app")

const { loadPlanetsData } = require("./models/planetsModel")
const { loadLaunchesData } = require("./models/launchesModel")

const PORT = process.env.PORT || 4000



const server = http.createServer(app)




async function startServer () {
    
    await dbConnect()
    await loadPlanetsData()
    await loadLaunchesData()

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
        
    })
}

startServer()

