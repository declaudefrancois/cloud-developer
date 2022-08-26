import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";

import { Car, cars as cars_list } from "./cars";

(async () => {
  let cars: Car[] = cars_list;

  //Create an express application
  const app = express();
  //default port to listen
  const port = 8082;

  //use middleware so post bodies
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json());

  // Root URI call
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Cloud!");
  });

  // Get a greeting to a specific person
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get("/persons/:name", (req: Request, res: Response) => {
    let { name } = req.params;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get("/persons/", (req: Request, res: Response) => {
    let { name } = req.query;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as
  // an application/json body to {{host}}/persons
  app.post("/persons", async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Get cars list
  app.get("/cars/", (req: Request, res: Response) => {
    // destruct our query paramaters
    let { make } = req.query;

    let cars_list = cars;

    // if we have an optional query paramater, filter by it
    if (make) {
      cars_list = cars.filter((car) => car.make === make);
    }

    // return the resulting list along with 200 success
    res.status(200).send(cars_list);
  });

  // Get one ar by id
  app.get("/cars/:id", (req: Request, res: Response) => {
    let { id } = req.params;

    if (!id) {
      return res.status(400).send("Bad request. Id is required !");
    }

    const car = cars.filter((car) => car.id === +id);

    if (car && car.length === 0) {
      return res.status(404).send("Not found");
    }

    res.status(200).send(car);
  });

  // create new car
  app.post("/cars/", (req: Request, res: Response) => {
    let { make, type, model, cost, id } = req.body;

    if (!id || !type || !model || !cost) {
      return res.status(400).send("Fields make, type, model, cost, id are required");
    }

    const new_car: Car = {
      make: make,
      type: type,
      model: model,
      cost: cost,
      id: id,
    };

    cars.push(new_car);

    res.status(201).send(new_car);
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
