const request = require("supertest")
const app = require("../../app")
const { dbConnect, dbDisconnect }= require("../../services/db")


describe("Launches API", () => {
  beforeAll(async () => {
    await dbConnect()
  })
  afterAll(async () => {
    await dbDisconnect()
  })

    describe("Test GET /launches", () => {
        test("It should respond with 200 success", async () => {
            const response = await request(app)
                .get("/v1/launches")
                .expect("Content-Type", /json/)
                .expect(200)


        })
    })

    describe("Test POST /launches", () => {
        const completeLaunchData = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",
            launchDate: "January 4 2028"
        }

        const launchDataWithoutDate = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",

        }

        const launchDataWithInvalidDate = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",
            launchDate: "zoot"
        }


        test("It should respond with 201 created", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(completeLaunchData)
                .expect("Content-Type", /json/)
                .expect(201)




            const requestDate = new Date(completeLaunchData.launchDate).valueOf()
            const responseDate = new Date(response.body.launch.launchDate).valueOf()


            expect(responseDate).toBe(requestDate)
            expect(response.body.success).toStrictEqual(true)
            expect(response.body.launch.flightNumber).toStrictEqual(response.body.launch.flightNumber++)
            console.log(response.body.launch.flightNumber);


            expect(response.body.launch).toMatchObject(launchDataWithoutDate)





        })
        test("It should catch missing required properties", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(launchDataWithoutDate)
                .expect("Content-Type", /json/)
                .expect(400)




            expect(response.body["error"]).toStrictEqual("Missing required launch property")

        })
        test("It should catch invalid dates", async () => {
            const response = await request(app)
                .post("/v1/launches")
                .send(launchDataWithInvalidDate)
                .expect("Content-Type", /json/)
                .expect(400)
            expect(response.body["error"]).toStrictEqual("Invalid launch date")
        })
    })
})