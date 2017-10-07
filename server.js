const express = require('express'); // allows us to run express on top of node and write code that is easier to read and understand
const app = express(); // creates an instance of express
const path = require('path'); // allows us to serve up static assets

const bodyParser = require('body-parser'); // allows express to ready the body of a post

const environment = process.env.NODE_ENV || 'development'; // environment variable that app should run in
const configuration = require('./knexfile')[environment]; // fetches the db config for whatever environment we are in
const database = require('knex')(configuration); // allows the express app to connect to environment

app.use(express.static(path.join(__dirname, 'public'))); // middleware that is serving up static assets in the public directory

app.use(bodyParser.json()); // middleware that parses the body of a post into a JSON object
app.use(bodyParser.urlencoded({ extended: true })); //middleware that only parses urlencoded bodies and only looks at requests where the Content-Typer header matches the type option

app.set('port', process.env.PORT || 3000); // sets the port for the server to run on
app.locals.title = 'Palette Picker'; // local variable that is not saved

// a GET request to '/'(the root). The callback takes 2 arguments, the request and the response object(this is true for all requests). The handler is sending back a response with the text of 'Welcome to Palette Picker!'
app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker!')
});

// a post request to the projects table in the db
app.post('/api/v1/projects', (request, response) => { // request and response objects passed into callback
  const project = request.body; // setting the body of the request to a variable

  for (let requiredParameter of ['name']) { // requires the user to submit a 'name' param
    if (!project[requiredParameter]) { // if the user does not send a name param in the request body,
      return response // a response object is returned to the user with a status code of 422
        .status(422) //notifiying the user of the expected format and that they are missing a required property
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` })
    }
  }

  // if the request body contains the required params, the body of the request is added to the projects table
  database('projects').insert(project, '*') // returns a promise of an array with an object of the project that was added
    .then(results => { // the promise is consumed
      response.status(201).json(results) //a status code of 201 is returned indicating that the project was successfully added and converted into a json object
    })
    .catch(error => { // if there is a problem adding the project,
      response.status(500).json({ error }) // a status code of 500 is returned notifying the user of an internal server eror
    })
})

// a post request to the palettes table in the db
app.post('/api/v1/palettes', (request, response) => { // request and response objects passed into callback
  const palette = request.body; // setting the boby of the request to a variable

  for (let requiredParameter of ['name', 'hex_val_1', 'hex_val_2', 'hex_val_3', 'hex_val_4', 'hex_val_5', 'project_id']) { //requires the user to submit a 'name', 'hex_val_1', 'hex_val_2', 'hex_val_3', 'hex_val_4', 'hex_val_5', and 'project_id' param in the request
    if (!palette[requiredParameter]) { // if th user does not send all of the required params in the request,
      return response // a response object is returned to the user with a status code of 422
        .status(422) //notifiying the user of the expected format of the request and that they are missing a required property
        .send({ error: `Expected format: { name: <String>, hex_val_1: <String>, hex_val_2: <String>, hex_val_3: <String>, hex_val_4: <String>, hex_val_5: <String>, project_id: <Integer> }. You're missing a "${requiredParameter}" property.` })
    }
  }

  // if the request body contains the required params, the body of the request is added to the palettes table
  database('palettes').insert(palette, '*')
    .then(results => { // returns a promise of an array with an object of the palette that was added
      response.status(201).json(results) // a status code of 201 is returned indicating that the palette was successfully added and converted into a json object
    })
    .catch(error => { // if there is a problem adding the palette,
      response.status(500).json({ error }) // a status code of 500 is returned notifying the user of an internal server eror
    })
})

// makes a request to the projects table in the db
app.get('/api/v1/projects', (request, response) => { // request and response objects passed into callback
  database('projects').select() // makes a selection for all the projects in the db
    .then(projects => { // returns an array of all the projects that have been added to the db
      response.status(200).json(projects) // a status code of 200 is returned indicating that all the projects were successfully returned and converted into a json object
    })
    .catch(error => { // if there is a problem retrieving the projects,
      response.status(500).json({ error }) // a status code of 500 is returned notifying the user of an internal server eror
    })
})

// makes a request to the palettes table in the db
app.get('/api/v1/palettes', (request, response) => { // request and response objects passed into callback
  database('palettes').select() // makes a selection for all the palettes in the db
    .then(palettes => { // returns an array of all the palettes that have been added to the db
      response.status(200).json(palettes) // a status code of 200 is returned indicating that all the palettes were successfully returned and converted into a json object
    })
    .catch(error => { // if there is a problem retrieving the palettes
      response.status(500).json({ error }) // a status code of 500 is returned notifying the user of an internal server eror
    })
})

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;

  database('palettes').where({ project_id: id }).select()
  .then(palettes => {
    response.status(200).json(palettes)
  })
  .catch(error => { // if there is a problem retrieving the palettes for a specific proejct,
    response.status(500).json({ error }) // a status code of 500 is returned notifying the user of an internal server eror
  })
})

app.delete('/api/v1/palettes/:id', (request, response) => {
  const { id } = request.params;

  database('palettes').where({ id }).del()
  .then(palette => {
    if (palette) {
      response.sendStatus(204)
    } else {
      response.status(422).json({ error: 'Not Found' })
    }
  })
  .catch(error => { // if there is a problem deleting a specific palette,
    response.status(500).json({ error }) // a status code of 500 is returned notifying the user of an internal server eror
  })
})


// server is listening for requests on specific port and notifies you in the terminal that the server is running
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app; // exports the server
