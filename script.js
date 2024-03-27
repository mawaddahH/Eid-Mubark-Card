document.addEventListener('DOMContentLoaded', (event) => {
  const canvas = document.getElementById('imageCanvas');
  const ctx = canvas.getContext('2d');
  let imageSrcs = {
    square: 'تهنئة-العيد-مربع.png', // Replace with your square image path
    rectangle: 'تهنئة-العيد-طولي.png' // Replace with your rectangle image path
  };
  let currentImageSrc = imageSrcs.square; // Default image
  let name = 'اكتب اسمك';
  let fontSize = 25; // This will be updated based on image shape
  let squareFontSize = 25; // Font size for square image
  let rectangleFontSize = 18; // Font size for rectangle image
  let fontFamily = 'EidFont'; // Update to match your desired font
  let color = '#C06864'; // Initial color
  let textPosition = { x: 0, y: 0 }; // Updated to manage position

  // Load the default image
  const image = new Image();
  loadImage(currentImageSrc);

  // Ensure the correct radio button for the image shape is selected by default
  document.querySelector('input[value="square"]').checked = true;
  // Initially call updateRadioSelection to set the correct state at load
  updateRadioSelection();

  function loadImage(src) {
    image.onload = function() {
      updateCanvasSize();
      setTextPosition();
      updateText();
    };
    image.src = src;
  }

  function updateCanvasSize() {
    if (currentImageSrc === imageSrcs.square) {
      canvas.width = 500;
      canvas.height = 500;
      fontSize = squareFontSize;
    } else {
      canvas.width = 300;
      canvas.height = 500;
      fontSize = rectangleFontSize;
    }
  }

  function setTextPosition() {
    if (currentImageSrc === imageSrcs.square) {
      textPosition.x = canvas.width / 2;
      textPosition.y = canvas.height / 2 + 150;
    } else {
      textPosition.x = canvas.width / 2;
      textPosition.y = canvas.height - 125;
    }
  }

  function updateText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, textPosition.x, textPosition.y);
  }

  // Event listeners for user inputs
  document.getElementById('nameInput').addEventListener('input', function() {
    name = this.value;
    updateText();
  });

  document.querySelectorAll('input[name="textColor"]').forEach((radio) => {
    radio.addEventListener('change', function() {
      color = this.value;
      updateText();
      updateTickMarks();
    });
  });

  document.querySelectorAll('input[name="imageShape"]').forEach((radio) => {
    radio.addEventListener('change', function() {
      currentImageSrc = imageSrcs[this.value];
      loadImage(currentImageSrc);
      updateRadioSelection(); // Call this function to update the label styles
    });
  });

  // This function updates the visual feedback for the image shape selection
  function updateRadioSelection() {
    document.querySelectorAll('#imagePicker input[type="radio"]').forEach(radio => {
      let label = document.querySelector(`label[for="${radio.id}"]`);
      if (radio.checked) {
        label.style.backgroundColor = '#e8e8e8'; // Selected state
        label.style.borderColor = '#ddd';
      } else {
        // Reverting to default styles defined in CSS
        label.style.backgroundColor = '#fff'; // Default background
        label.style.borderColor = '#ddd'; // Default border
      }
    });
  }

  // Get all the radio buttons for text color
  const textColorRadios = document.querySelectorAll('input[type="radio"][name="textColor"]');

  // Function to update tick marks for color selection based on the checked state
  function updateTickMarks() {
    document.querySelectorAll('input[name="textColor"]').forEach((radio) => {
      // Since the .tick-mark is a sibling to the radio input, find the parent first (label), then find the .tick-mark within it
      const tickMark = radio.parentElement.querySelector('.tick-mark');
      if (radio.checked) {
        tickMark.style.display = 'block';
      } else {
        tickMark.style.display = 'none';
      }
    });
  }


  // Listen for changes on each radio button for text color
  textColorRadios.forEach((radio) => {
    radio.addEventListener('change', updateTickMarks);
  });

  // Initial update of tick marks
  updateTickMarks();

  function handleDownload() {
    // Logic for downloading the customized image
    console.log("Download button clicked");
    let tempCanvas = document.createElement('canvas');
    let tempCtx = tempCanvas.getContext('2d');

    let originalImage = new Image();
    originalImage.onload = function() {
      tempCanvas.width = this.naturalWidth;
      tempCanvas.height = this.naturalHeight;

      tempCtx.drawImage(originalImage, 0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.font = `${fontSize}px ${fontFamily}`;
      tempCtx.fillStyle = color;
      tempCtx.textAlign = 'center';
      tempCtx.textBaseline = 'middle';

      let scaledX = tempCanvas.width / 2;
      let scaledY = tempCanvas.height / 2;

      tempCtx.fillText(name, scaledX, scaledY);

      let link = document.createElement('a');
      link.download = 'customized-image.png';
      link.href = tempCanvas.toDataURL();
      link.click();
    };
    originalImage.src = currentImageSrc;
  }

  document.getElementById('downloadBtn').addEventListener('click', handleDownload);

  // Load the specified font and then update the text
  document.fonts.load('10pt "EidFont"').then(updateText);

  // Initially call updateRadioSelection to set the correct state at load
  updateRadioSelection();

  // Initial update
  updateTickMarks();
});
