const axios = require("axios")

const launchModel = require("./launchMongo")
const planetModel = require("./planetsMongo")

const DEFAULT_FLIGHT_NUMBER = 100

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"

async function populateLaunches() {
    console.log("Downloading launch data");
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    })

    if (response.status !== 200) {
        console.log("Problem downloading launch data");
        throw new Error("Launch data download failed")
        
    }
    const launchDocs = response.data.docs
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc["payloads"]
        console.log(payloads);
        
     
        const customers = payloads.flatMap((payload) => {
            return payload["customers"]
        })
        console.log(customers);
        

        
        
        
        
        const launch = {
            flightNumber: launchDoc["flight_number"],
            mission: launchDoc["name"],
            rocket: launchDoc["rocket"]["name"],
            launchDate: launchDoc["date_local"],
            upcoming: launchDoc["upcoming"],
            success: launchDoc["success"],
            customers

        }
        console.log(`${launch.flightNumber} ${launch.mission} customers=> ${launch.customers}`);

        await saveLaunch(launch)
        
    }
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: "Falcon 1",
        mission: "FalconSat"
    })

    if (firstLaunch) {
        console.log("Launch data already loaded");
    } else {
        await populateLaunches()
    }


} 

async function findLaunch (filter) {
    return await launchModel.findOne(filter)
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId
    })
}

async function getLastestFlightNumber() {
    const latestLaunch = await launchModel.findOne()
        .sort("-flightNumber")

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

async function getAllLaunches(skip, limit) {

    //return Array.from(launches.values());
    return await launchModel
      .find({}, { "_id": 0, "__v": 0 })
      .sort({ flightNumber: 1 })
      .skip(skip)
      .limit(limit)


}

async function saveLaunch(launch) {

    await launchModel.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true
    }
    )
}

async function scheduleNewLaunch(launch) {

    const matchingPlanet = await planetModel.findOne({ keplerName: launch.target })

    if (!matchingPlanet) {
        throw new Error("No matching planet found")
    }
    const newFlightNumber = await getLastestFlightNumber() + 1
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ["Zero to Mastery", "NASA"],
        flightNumber: newFlightNumber

    })

    await saveLaunch(newLaunch)
}


async function abortLaunchById(launchId) {

    const aborted = await launchModel.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })

    return aborted.acknowledged === true && aborted.modifiedCount === 1
}



module.exports = {
    loadLaunchesData,
    existsLaunchWithId,
    getAllLaunches,
    abortLaunchById,
    scheduleNewLaunch,
}


//console.log(launches);

// Iterate over the Map using for...of
//    for (const [flightNumber, launch] of launches) {
//        console.log(flightNumber, launch); // Logs the flight number and the corresponding launch object
//    }