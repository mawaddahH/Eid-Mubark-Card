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
      let imgRatio = image.naturalWidth / image.naturalHeight;
      let containerMaxSize = 400; // Maximum size for both width and height

      if (imgRatio > 1) { // Image is wider than tall (landscape)
          canvas.width = containerMaxSize;
          canvas.height = containerMaxSize / imgRatio;
      } else if (imgRatio < 1) { // Image is taller than wide (portrait)
          canvas.width = containerMaxSize * imgRatio;
          canvas.height = containerMaxSize;
      } else { // Image is square
          canvas.width = containerMaxSize;
          canvas.height = containerMaxSize;
      }

      // Adjust the fontSize based on the new canvas size
      fontSize = (canvas.width > canvas.height ? canvas.height : canvas.width) / 20;
  }


  function setTextPosition() {
    if (currentImageSrc === imageSrcs.square) {
      textPosition.x = canvas.width / 2;
      textPosition.y = canvas.height / 2 + 115;
    } else {
      textPosition.x = canvas.width / 2;
      textPosition.y = canvas.height - 110;
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
  let tempCanvas = document.createElement('canvas');
  let tempCtx = tempCanvas.getContext('2d');

  let originalImage = new Image();
  originalImage.onload = function() {
    // Set the temporary canvas size to the original image size
    tempCanvas.width = this.naturalWidth;
    tempCanvas.height = this.naturalHeight;

    // Draw the original image on the temporary canvas
    tempCtx.drawImage(originalImage, 0, 0, tempCanvas.width, tempCanvas.height);

    // Calculate the scale ratios
    let scaleX = tempCanvas.width / canvas.width;
    let scaleY = tempCanvas.height / canvas.height;

    // Adjust the font size based on the scale ratio
    // Assuming the font size should scale similarly in both dimensions, you can use either scaleX or scaleY.
    // Using the average of scaleX and scaleY to maintain the relative aspect ratio of the text size to the image.
    let adjustedFontSize = fontSize * ((scaleX + scaleY) / 2);
    tempCtx.font = `${adjustedFontSize}px ${fontFamily}`;
    tempCtx.fillStyle = color;
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';

    // Calculate the adjusted position for the text
    // Since we're maintaining the aspect ratio, you can use either scaleX or scaleY to adjust the text's position.
    // This example uses scaleY for Y to ensure vertical alignment is consistent with your original design.
    let scaledX = tempCanvas.width / 2; // Centered horizontally
    let scaledY = textPosition.y * scaleY; // Adjusted vertically based on the scale

    // Draw the text on the temporary canvas at the adjusted position
    tempCtx.fillText(name, scaledX, scaledY);

    // Determine the image name based on the selected shape
    let imageName;
    if (currentImageSrc === imageSrcs.square) {
      imageName = "EidCardByMWDH-Square.png";
    } else if (currentImageSrc === imageSrcs.rectangle) {
      imageName = "EidCardByMWDH-rectangle.png";
    } else {
      // Fallback name if needed
      imageName = "customized-image.png";
    }

    // Create a link and trigger the download with the determined image name
    let link = document.createElement('a');
    link.download = imageName; // Use the dynamically set name here
    link.href = tempCanvas.toDataURL();
    link.click();

    // After initiating the download, show the success modal
    showDownloadSuccessModal();
  };
  originalImage.src = currentImageSrc;
}

function showDownloadSuccessModal() {
  const modal = document.getElementById('downloadSuccessModal');
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  document.querySelector('.close-button').onclick = function() {
    modal.style.display = "none";
  };

  // Also close the modal if the user clicks anywhere outside of it
  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}



  document.getElementById('downloadBtn').addEventListener('click', handleDownload);

  // Load the specified font and then update the text
  document.fonts.load('10pt "EidFont"').then(updateText);

  // Initially call updateRadioSelection to set the correct state at load
  updateRadioSelection();

  // Initial update
  updateTickMarks();
});
