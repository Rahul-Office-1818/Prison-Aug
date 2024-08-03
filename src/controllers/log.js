import { Router } from "express";
import Log from "../models/Log.js";
import middleware from "../../middleware/middleware.js";
import { Op } from "sequelize";

const logRoutes = Router();

logRoutes.get("/", middleware, async (req, res) => {
  let start = req.query.start;
  let end = req.query.end;
  let blockId = req.query.blockId;


  console.log(start,end,"is this 24 hrs");


  console.log(start, end, blockId);
  let whereClause = {};
  if (!start && !end) {
    console.log("if is called");
    try {
      const logs = await Log.findAll({
        limit: 500,
        order: [["id", "DESC"]],
      });
      return res
        .status(200)
        .json({ message: "Logs retrieved successfully!", payload: logs });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error!",
        err: err,
        endPoint: "/api/logs",
      });
    }
  } else {
    try {
      whereClause = {
        createdAt: {
          [Op.between]: [start, end],
        },
        // blockId: 1,
        
      };
      
      
      if (blockId >= 1 && blockId <= 10) {
        whereClause.blockId = blockId; // Filter logs where blockId is equal to the provided value
      } else if (blockId === 0) {
        whereClause.blockId = { [Op.is]: null }; // Filter logs where blockId is blank
      }

      const filteredlogs = await Log.findAll({
        where: whereClause,
        limit: 500,
        order: [["id", "DESC"]],
      });
      console.log("else is called");

      console.log(filteredlogs.length);
      console.log(start, end);

      return res.status(200).json({
        message: "Logs retrieved successfully!",
        payload: filteredlogs,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Internal server error!",
        err: err,
        endPoint: "/api/logs",
      });
    }
  }
});

export default logRoutes;
