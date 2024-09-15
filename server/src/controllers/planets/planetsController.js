const { getAllPlanets } = require("../../models/planetsModel")

function httpGetAllPlanets (req, res) {
    try {
        return res.status(200).json({ success: true, planets: getAllPlanets() })
    } catch (err) {
       return res.json({ success: false, error: err })
    }
}

module.exports = { httpGetAllPlanets }