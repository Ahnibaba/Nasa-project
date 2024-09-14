//import axios from "axios"

const backendUrl = "http://localhost:4000"


// Load planets and return as JSON.
async function httpGetPlanets() {

  // const response = await axios.get(`${backendUrl}/planets`)
  // console.log(response.data.planets);
  // if (response.data.success) {
  //   return response.data.planets
  // }

  const response =  await fetch(`${backendUrl}/planets`)
  const data = await response.json()
  console.log(data.planets);
  
  if (data.success) {
    return data.planets
  }
  
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${backendUrl}/launches`)
  const data = await response.json()
  console.log(data.launches);

  if (data.success) {
    return data.launches?.sort((a, b) => {
      return a.flightNumber - b.flightNumber
    })
  }
  
  
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${backendUrl}/launches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(launch)
    })
  
  } catch (err) {
     return {
      ok: false
     }
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${backendUrl}/launches/${id}`, {
      method: "DELETE"
    })
    
  } catch (err) {
    console.log("error: " + err);
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};