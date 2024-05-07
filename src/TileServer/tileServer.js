// const fs = require('fs');
// const sharp = require('sharp');
// const path = require('path');


import fs from 'fs';
import path from 'path';


const TileserverPage = async (req, res) => {

    try {
        // Extract x, y, and z parameters from the request query
        const x = req.query.x;
        const y = req.query.y;
        const z = req.query.z;
        let imagePath = `${path.join(path.resolve(process.cwd()),'..')}/Tile_map/tile/${z}/${x}/${y}`

        console.log(imagePath,"Datraaaaaaa");
        fs.readFile(imagePath, function(err, data) {
            // console.log(data,"Datraaaaaaa");
              res.writeHead(200, {'Content-Type': 'image/jpeg'})
              res.end(data) // Send the file data to the browser.
            // })
          });
        
    } catch (error) {
        console.error(error);
        res.status(404).json({ data: "Internal Server Error!!!" });
    }
}
export default TileserverPage;