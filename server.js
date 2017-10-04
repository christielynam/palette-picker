const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

// app.post('/api/v1/projects', (request, response) => {
//   const { name } = request.body;
//
//   database('projects').insert({ name }, '*')
//     .then(results => response.status(201).json(results))
// })

// app.post('/api/v1/palettes', request, response) => {
//   const { name, hex_val_1, hex_val_2, hex_val_3, hex_val_4, hex_val_5, project_id } = response.body;
//
//   database('palettes').insert({ name, hex_val_1, hex_val_2, hex_val_3, hex_val_4, hex_val_5, project_id }, '*')
//     .then(results => response.status(201).json(results))
// }

app.get('/api/v1/projects', (request, response) => {
  response.status(200).json(response)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
