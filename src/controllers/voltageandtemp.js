import { Router } from 'express';

import { ardiunoCommunication } from "./common.helper.js";


const VoltageAndTemp = Router();




// VoltageAndTemp.get("/", async (req, res) => {
//           let pcuIp = req.query.pcuIp;
//           let pcuPort = req.query.pcuPort;
//           console.log(pcuIp, pcuPort, "address");


//           try {

//                     const promise = await ardiunoCommunication("voltage", { address: pcuIp, port: pcuPort });

//                     // const response = String(promise.payload);

//                     console.log(promise.payload, "voltage vlaue");
//                     const response = promise.payload;
//                     res.status(200).json({ payload: response });



//           } catch (error) {
//                     console.log(error);
//                     res.status(500).json({ payload: { message: 'Invalid request', error } });

//           }









// })
// const tempAndvoltage = Router();
// tempAndvoltage.get("/", async (req, res) => {
//           let PcuIP = req.query.pcuIp;
//           let PcuPort = req.query.pcuPort;
//           try {
//                     const promise = await ardiunoCommunication("temp", { address: PcuIP, port: PcuPort });
//                     const response = promise.payload;
//                     res.status(200).json({ payload: response });
//           } catch (error) {

//                     console.log(error);
//                     res.status(500).json({ payload: { message: 'Something went wrong', error } });


//           }
// })

// export { VoltageAndTemp, tempAndvoltage };



VoltageAndTemp.get("/", async (req, res) => {
          let pcuIp = req.query.pcuIp;
          let pcuPort = req.query.pcuPort;
          console.log(pcuIp, pcuPort, "address");

          try {
                    const voltagePromise = ardiunoCommunication("voltage", { address: pcuIp, port: pcuPort });
                    const tempPromise = ardiunoCommunication("temp", { address: pcuIp, port: pcuPort });

                    const [voltageResponse, tempResponse] = await Promise.all([voltagePromise, tempPromise]);

                    res.status(200).json({
                              payload: {
                                        voltage: voltageResponse.payload,
                                        temperature: tempResponse.payload,
                              },
                    });
          } catch (error) {
                    console.log(error);
                    res.status(500).json({ payload: { message: 'Invalid request', error } });
          }
});


export default VoltageAndTemp;    