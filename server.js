const express = require('express'); // allows us to run express on top of node and write code that is easier to read and understand
const app = express(); // creates an instance of express
const path = require('path'); // allows us to serve up static assets

const bodyParser = require('body-parser'); // allows express to ready the body of a post

const environment = process.env.NODE_ENV || 'development'; // environment variable that app should run in
const configuration = require('./knexfile')[environment]; // fetches the db config for whatever environment we are in
const database = require('knex')(configuration); // allows the express app to connect to environment

app.use(express.static(path.join(__dirname, 'public'))); // middleware that is serving up static assets in the public directory

app.use(bodyParser.json()); // middleware that parses the body of a post into a JSON object
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000); // sets the port for the server to run on
app.locals.title = 'Palette Picker'; // local variable that is not saved

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker!')
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` })
    }
  }

  database('projects').insert(project, '*')
    .then(results => {
      response.status(201).json(results)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['name', 'hex_val_1', 'hex_val_2', 'hex_val_3', 'hex_val_4', 'hex_val_5', 'project_id']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, hex_val_1: <String>, hex_val_2: <String>, hex_val_3: <String>, hex_val_4: <String>, hex_val_5: <String>, project_id: <Integer> }. You're missing a "${requiredParameter}" property.` })
    }
  }

  database('palettes').insert(palette, '*')
    .then(results => {
      response.status(201).json(results)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => {
      response.status(200).json(projects)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => {
      response.status(200).json(palettes)
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;

  database('palettes').where({ project_id: id }).select()
  .then(palettes => {
    response.status(200).json(palettes)
  })
  .catch(error => {
    response.status(500).json({ error })
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
  .catch(error => {
    response.status(500).json({ error })
  })
})


// server is listening for requests on specific port and notifies you in the terminal that the server is running
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app; // exports the server
