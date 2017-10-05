const generateRandomColor = () => {
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const setColors = () => {
  for (let i = 1; i < 6; i++) {
    if (!$(`.color${i}`).hasClass('locked-color')) {
      let color = generateRandomColor();
      $(`.color${i}`).css('background-color', color);
      $(`.val${i}`).text(color);
    }
  }
}

const appendProject = (results) => {
  const projectName = `<option value=${results.id}>${results.name}</option>`
  const project = `<article class="project-details">
    <h2 class='project-name'>${results.name}</h2>
  </article>`

  $('.select-folder').append(projectName);
  $('.project-container').append(project);
}

const appendNewPalette = () => {
  const paletteName = $('.palette-name-input').val()
  const palette = `<div class="palette-details">
    <p class='palette-name'>${paletteName}</p>
    <div class='small-color-block block1'></div>
    <div class='small-color-block block2'></div>
    <div class='small-color-block block3'></div>
    <div class='small-color-block block4'></div>
    <div class='small-color-block block5'></div>
    <img class='trash-icon' src="./assets/trash.svg" alt="trash">
  </div>`
  $('.project-details').append(palette);
  $('.palette-name-input').val('');
}

const fetchProjects = () => {
  fetch('/api/v1/projects')
  .then(response => response.json())
  .then(projects => {
    projects.forEach(project => {
      appendProject(project)
      // fetch('/api/v1/palettes/:project.id')
      // .then(response => response.json())
      // .then(palettes => console.log(palettes))
    })
  })
  .catch(error => console.log(error))
}

const fetchPalettes = () => {
  fetch('/api/v1/palettes')
  .then(response => response.json())
  .then(palettes => {
    console.log(palettes);
  })
}

const createNewProject = () => {
  const projectName = $('.project-name-input').val();
  fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: projectName })
  })
  .then(response => {
    if (response.status === 201) {
      return response.json()
    }
  })
  .then(results => appendProject(results[0]))
  .catch(error => console.log(error))

  $('.project-name-input').val('');
}

const addNewPalette = () => {
  const paletteName = $('.palette-name-input').val();
  const hexVal1 = $('.val1');
  const hexVal2 = $('.val2');
  const hexVal3 = $('.val3');
  const hexVal4 = $('.val4');
  const hexVal5 = $('.val5');

  fetch('/api/v1/palettes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: paletteName, hex_val_1: hexVal1, hex_val_2: hexVal2, hex_val_3: hexVal3, hex_val_4: hexVal4, hex_val_5: hexVal5, project_id: $('.selected-project').val() })
  })
}
//add selected-project class to selected option

const deletePalette = (e) => {
  $(e.target).parents('.palette-details').remove();
}



// Event Listeners
$(document).ready(() => {
  setColors();
  fetchProjects();
  fetchPalettes();
});


$('.generate-palette-btn').on('click', setColors);


$('.color-container').on('click', '.lock-img', (e) => {
  $(e.target).toggleClass('locked');
  $(e.target).parents('.color').toggleClass('locked-color')
})


$('.save-palette-btn').on('click', appendNewPalette)


$('.save-project-btn').on('click', createNewProject)


$('.project-container').on('click', '.trash-icon', deletePalette)
