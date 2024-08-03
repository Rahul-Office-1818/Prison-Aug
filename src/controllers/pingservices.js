import { Router } from "express";
import moment from "moment";
import "moment-precise-range-plugin";
import middleware from "../../middleware/middleware.js";
import Jammer from "../models/Jammer.js";
import { checkConnection } from "./common.helper.js";
import PowerFailure from "../models/PowerFailure.js";

export class PingServices {
  routes;
  intervalId;

  constructor() {
    this.routes = Router();
    this.pingRoutes();
    this.startCheckingStatus();
  }

  pingRoutes() {
    this.routes.get("/all", middleware, this.all);
  }

  async all(_, res) {
    try {
      const jammers = await Jammer.findAll();
      const all = await checkConnection(jammers);


      console.log(all,"all jammers");
      // console.log(all, "jammer status");
      res.json({ payload: all, status: 200 });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error!", error });
    }
  }

  startCheckingStatus() {
    this.intervalId = setInterval(async () => {
      try {
        const jammers = await Jammer.findAll();
        const all = await checkConnection(jammers);
        let date_ob = new Date();
        let date = ("0" + date_ob.getDate()).slice(-2);
        let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
        let year = date_ob.getFullYear();
        let hours = ("0" + date_ob.getHours()).slice(-2);
        let minutes = ("0" + date_ob.getMinutes()).slice(-2);
        let seconds = ("0" + date_ob.getSeconds()).slice(-2);
        let datestring =
          year +
          "-" +
          month +
          "-" +
          date +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds;
        const offlineDevices = all
          .filter((device) => !device.alive)
          .map((device) => ({
            jammer_id: device.jammerId,
            jammer_name: device.jammerName,
            block_id: device.blockId,
            status: device.alive,
          }));

        const currentDate = new Date();

        for (const device of offlineDevices) {
          const options = {
            where: {
              jammer_id: device.jammer_id,
            },
            order: [["id", "DESC"]],
            limit: 1,
          };

          const latestPowerFailure = await PowerFailure.findOne(options);

          if (latestPowerFailure) {
            const powerFailureDate = new Date(latestPowerFailure.To);
            var abc = moment(powerFailureDate);
            var efg = moment(datestring);
            let diffInSeconds = efg.diff(abc, "seconds");
            if (diffInSeconds < 90) {
              let start_time = moment(latestPowerFailure.dataValues.FROM);
              let end_time = moment(datestring);
              let diff = moment.preciseDiff(start_time, end_time, true);
              let timeDuration = "";
              for (const key in diff) {
                if (diff[key] !== 0 && diff[key] != false) {
                  timeDuration = timeDuration + " " + diff[key] + " " + key;
                }
              }
              await PowerFailure.update(
                { To: datestring, Duration: timeDuration },
                { where: { id: latestPowerFailure.dataValues.id } }
              );
              console.log("PowerFailure Log updated");
            } else {
              await PowerFailure.create({
                jammer_id: device.jammer_id,
                jammer_name: device.jammer_name,
                FROM: datestring,
                To: datestring,
                Duration: "0",
                time: currentDate.toISOString(),
              });
              console.log("New PowerFailure Log created");
            }
          } 
          else {
            await PowerFailure.create({
              jammer_id: device.jammer_id,
              jammer_name: device.jammer_name,
              FROM: datestring,
              To: datestring,
              Duration: "0",
              time: currentDate.toISOString(),
            });
            console.log("New PowerFailure Log created in else");
          }

        }
      } catch (error) {
        console.log(error);
      }
    }, 1000);
  }
  stopCheckingStatus() {
    clearInterval(this.intervalId);
  }
}

const pingServices = new PingServices().routes;

export default pingServices;
