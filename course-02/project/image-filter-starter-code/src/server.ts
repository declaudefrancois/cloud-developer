import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isUrlValid} from './util/util'; 

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Filter image endpoint
  app.get('/filteredimage', async (req: Request, res: Response) => {
    const { image_url } = req.query;

    if (!image_url || !isUrlValid(image_url)) {
      return res.status(400).send({message: "Bad request. Image url is not specified or not valid."})
    } 

    try {
      const file = await filterImageFromURL(image_url);
      
      res.on("finish", () => {
        deleteLocalFiles([file]);
      });
      
      res.sendFile(file)
    } catch (error) {
      res.status(500).send({message: "Oooops something went wrong !!!"});
    }  
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