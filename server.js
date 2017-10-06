const express = require('express');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('Welcome to Palette Picker!');
});



app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert(project, '*')
    .then(results => {
      response.status(201).json(results)
    })
    .catch(error => {
      response.status(500).json({ error });
    })
})

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['name', 'hex_val_1', 'hex_val_2', 'hex_val_3', 'hex_val_4', 'hex_val_5', 'project_id']) {
    if (!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String>, hex_val_1: <String>, hex_val_2: <String>, hex_val_3: <String>, hex_val_4: <String>, hex_val_5: <String>, project_id: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('palettes').insert(palette, '*')
    .then(results => {
      response.status(201).json(results)
    })
    .catch(error => {
      response.status(500).json({ error });
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
  const { id } = request.params

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



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
