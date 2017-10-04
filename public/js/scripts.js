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
    let color = generateRandomColor();
    $(`.color${i}`).css('background-color', color);
    $(`.val${i}`).text(color);
  }
}

$(document).ready(setColors);

$('.generate-palette-btn').on('click', setColors);

// need to write toggleLocked function
// $('.color').on('click', e.target, toggleLocked)

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

$('.save-palette-btn').on('click', appendNewPalette)

// $('.save-project-btn').on('click', )

const deletePalette = () => {
  $('.palette-details').remove(); // this is removing all of them
}

$('.project-details').on('click', '.trash-icon', deletePalette)
