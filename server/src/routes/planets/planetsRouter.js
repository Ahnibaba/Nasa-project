const express = require("express")
 
const { httpGetAllPlanets } = require("../../controllers/planets/planetsController")


const planetsRouter = express.Router()

planetsRouter.get("/", httpGetAllPlanets)

          
module.exports = planetsRouter          