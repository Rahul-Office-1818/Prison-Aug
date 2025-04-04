import Jammer from "../models/Jammer.js";
import { ardiunoCommunication } from "./common.helper.js";

const AllJammerData = async (req, res) => {
  try {
    const jammers = await Jammer.findAll();

    return res.status(200).json({ message: "Jammers retrieved successfully!", jammers });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!", err });
  }
}



export const allJammersLastStatus = async function (request, response) {
  try {
    const jammers = await Jammer.findAll()
    const statusPromise = jammers.map(
      item => {
        const { ipAddress, ipPort } = item.dataValues
        return ardiunoCommunication("status", { address: ipAddress, port: ipPort });
      }
    )

    const statusResolve = await Promise.allSettled(statusPromise)
    const result = statusResolve.reduce((acc, curr, index) => {
      acc[jammers[index].dataValues.ipAddress] = curr;
      console.log(curr)
      return acc
    }, {})
    return response
      .status(200)
      .json({ result })

  } catch (error) {
    return response
      .status(500)
      .json({ message: "Internal server error" })
  }
}



export const JammerStatus = async (req, res) => {

  try {
    const jammers = req.body
    
    const promises = jammers.map(jammer => {
      const ipAddress = jammer.ipAddress
      const ipPort = jammer.ipPort

      console.log(`Calling ardiunoCommunication for ${ipAddress}...`)

      return ardiunoCommunication("status", { address: ipAddress, port: ipPort })
        .then(result => {
          console.log(`Received result for ${ipAddress}: ${result}`)
          return { [ipAddress]: result }
        })
        .catch(error => {
          console.error(`Error calling ardiunoCommunication for ${ipAddress}:`)
          console.error(error)
          return { [ipAddress]: error }
        })
    })

    const results = await Promise.all(promises)
    const mergedResults = results.reduce((acc, curr) => ({ ...acc, ...curr }), {})

    console.log(`Merged results: ${JSON.stringify(mergedResults)}`)

    res.status(200).json({ results: mergedResults })
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}
export default AllJammerData;