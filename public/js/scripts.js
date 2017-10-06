const generateRandomColor = () => {
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  };
  return color;
};

const setColors = () => {
  for (let i = 1; i < 6; i++) {
    if (!$(`.color${i}`).hasClass('locked-color')) {
      let color = generateRandomColor();
      $(`.color${i}`).css('background-color', color);
      $(`.val${i}`).text(color);
    };
  };
};

const appendProject = (results) => {
  const projectName = `<option value=${results.id} selected>${results.name}</option>`;
  const project = `<article class="project-details ${results.id}">
    <h2 class='project-name'>${results.name}</h2>
  </article>`;

  $('.select-folder').append(projectName);
  $('.project-container').append(project);
};

const appendAllPalettes = (palettes) => {
  palettes.forEach(palette => {
    const paletteName = palette.name;
    const projectPalette = `<div class="palette-details ${palette.id}">
      <p class='palette-name'>${paletteName}</p>
      <div class='small-color-block block1' style='background-color: ${palette.hex_val_1}'></div>
      <div class='small-color-block block2' style='background-color: ${palette.hex_val_2}'></div>
      <div class='small-color-block block3' style='background-color: ${palette.hex_val_3}'></div>
      <div class='small-color-block block4' style='background-color: ${palette.hex_val_4}'></div>
      <div class='small-color-block block5' style='background-color: ${palette.hex_val_5}'></div>
      <img class='trash-icon' src="./assets/trash.svg" alt="trash">
    </div>`;

    $(`.${palette.project_id}`).append(projectPalette);
  });
};

const appendNewPalette = (results) => {
  const paletteName = $('.palette-name-input').val();
  const palette = `<div class="palette-details">
    <p class='palette-name'>${paletteName}</p>
    <div class='small-color-block block1' style='background-color: ${results[0].hex_val_1}'></div>
    <div class='small-color-block block2' style='background-color: ${results[0].hex_val_2}'></div>
    <div class='small-color-block block3' style='background-color: ${results[0].hex_val_3}'></div>
    <div class='small-color-block block4' style='background-color: ${results[0].hex_val_4}'></div>
    <div class='small-color-block block5' style='background-color: ${results[0].hex_val_5}'></div>
    <img class='trash-icon' src="./assets/trash.svg" alt="trash">
  </div>`;

  $(`.${results[0].project_id}`).append(palette);
  $('.palette-name-input').val('');
};

const fetchProjects = () => {
  fetch('/api/v1/projects')
  .then(response => response.json())
  .then(projects => {
    projects.forEach(project => {
      appendProject(project);
      fetch(`/api/v1/projects/${project.id}/palettes`)
      .then(response => response.json())
      .then(palettes => appendAllPalettes(palettes))
    })
  })
  .catch(error => console.log(error))
};

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
};

const addNewPalette = () => {
  const paletteName = $('.palette-name-input').val();
  const hexVal1 = $('.val1').text();
  const hexVal2 = $('.val2').text();
  const hexVal3 = $('.val3').text();
  const hexVal4 = $('.val4').text();
  const hexVal5 = $('.val5').text();
  const projectId = $('.select-folder option:selected').val();

  fetch('/api/v1/palettes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: paletteName, hex_val_1: hexVal1, hex_val_2: hexVal2, hex_val_3: hexVal3, hex_val_4: hexVal4, hex_val_5: hexVal5, project_id: projectId })
  })
  .then(response => response.json())
  .then(palette => appendNewPalette(palette))
};

const deletePalette = (e) => {
  const id = $(e.target).parents('.palette-details').attr('class').split(' ')[1];
  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE'
  })
  .then(() => $(`.${id}`).remove())
  .catch(error => console.log(error))

  $(e.target).parents('.palette-details').remove();
};


// Event Listeners
$(document).ready(() => {
  setColors();
  fetchProjects();
});

$('.generate-palette-btn').on('click', setColors);

$('.color-container').on('click', '.lock-img', (e) => {
  $(e.target).toggleClass('locked');
  $(e.target).parents('.color').toggleClass('locked-color');
})

$('.save-palette-btn').on('click', addNewPalette);

$('.save-project-btn').on('click', createNewProject);

$('.project-container').on('click', '.trash-icon', deletePalette);
