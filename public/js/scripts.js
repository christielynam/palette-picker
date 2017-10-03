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
