const express = require('express');
const app = express();
const path = require('path');

app.get('/', (request, response) => {
  response.send('Palette Picker!!!');
});

app.listen(3000, () => {
  console.log('Express server running on localhost:3000');
})
