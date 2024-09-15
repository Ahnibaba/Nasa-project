const { getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById } = require("../../models/launchesModel")

function httpGetAllLaunches(req, res) {

  return res.status(200).json({ success: true, launches: getAllLaunches() })

}
const httpAddNewLaunch = (req, res) => {
  try {
    const launch = req.body

    
   
    

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
      return res.status(400).json({ success: false, error: "Missing required launch property" })
    }

    launch.launchDate = new Date(launch.launchDate)
    
    if (isNaN(launch.launchDate)) {
  
      return res.status(400).json({ success: false, error: "Invalid launch date" })
    }

    addNewLaunch(launch)
    return res.status(201).json({ success: true, launch })
  } catch (err) {
    console.log("Am here and error: " + err);
    return res.status(500).json({ success: false, error: err })
  }
}

const httpAbortLaunch = (req, res) => {
   const launchId = Number(req.params.id)

   if(!existsLaunchWithId(launchId)) {
      return res.status(404).json({ success: false, error: "Launch not found" })
   }

   const aborted = abortLaunchById(launchId)
   return res.status(200).json({ success: true, aborted })


}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch }




    //    if (launch.launchDate.toString() === "Invalid Date") {
    //      return res.status(400).json({ success: false, error: "Invalid launch date" })
    //    }