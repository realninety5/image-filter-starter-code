import express from 'express';
import fs from 'fs';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { Router, Request, Response } from 'express';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get( "/filteredimage", async(req: Request, res: Response) => {
    let image_url = req.query.image_url;
    if (image_url == undefined || image_url == "") {
      return res.status(400).send("Image url is required.");
    }
    let image_path = await filterImageFromURL(image_url);
    
    //console.log(image_path, "hello boy");

    fs.readFile(image_path, function (err, data) {
      if (err) throw err;
      res.writeHead(200, {'Content-Type': 'image/jpeg'})
      res.end(data)
      fs.unlink(image_path, err => {
          if (err) throw err;
      });;
    });
    

//    var dir = "./src/util/tmp"
//    fs.readdir(dir, (err, files) => {
//      if (err) throw err;
//  
//      for (const file of files) {
//        console.log(file);
//        fs.unlink(dir + file, err => {
//          if (err) throw err;
//        });
//      }
//    })

  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
