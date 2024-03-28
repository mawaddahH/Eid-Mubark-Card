// Listen for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', (event) => {
  // Get the canvas element and its context
  const canvas = document.getElementById('imageCanvas');
  const ctx = canvas.getContext('2d');

  // Define image sources for different shapes
  let imageSrcs = {
    square: 'تهنئة-العيد-مربع.png', // Path to the square image
    rectangle: 'تهنئة-العيد-طولي.png' // Path to the rectangle image
  };

  // Default image source and settings
  let currentImageSrc = imageSrcs.square; // Start with square image by default
  let name = 'اكتب اسمك'; // Default text
  let fontSize; // Font size will be updated dynamically
  let squareFontSize = 20; // Font size for square images
  let rectangleFontSize = 15; // Font size for rectangle images
  let fontFamily = 'EidFont'; // Font family for the text
  let color = '#C06864'; // Text color
  let textPosition = { x: 0, y: 0 }; // Position of the text, to be updated

  // Load the default image
  const image = new Image();
  loadImage(currentImageSrc);

  // Set the default selection for the image shape radio button
  document.querySelector('input[value="square"]').checked = true;
  // Update radio selection appearance
  updateRadioSelection();

  // Load image function
  function loadImage(src) {
    image.onload = function() {
      updateCanvasSize();
      setTextPosition();
      updateText();
    };
    image.src = src;
  }

  // Update the canvas size based on the loaded image
  function updateCanvasSize() {
    let imgRatio = image.naturalWidth / image.naturalHeight;
    let containerMaxSize = 400; // Max canvas size

    // Adjust canvas dimensions based on image aspect ratio
    if (imgRatio > 1) {
      canvas.width = containerMaxSize;
      canvas.height = containerMaxSize / imgRatio;
    } else if (imgRatio < 1) {
      canvas.width = containerMaxSize * imgRatio;
      canvas.height = containerMaxSize;
    } else {
      canvas.width = containerMaxSize;
      canvas.height = containerMaxSize;
    }

    // Adjust font size relative to canvas size differently for square and rectangle images
    if (currentImageSrc === imageSrcs.square) {
      // For square images, use a specific font size adjustment
      fontSize = squareFontSize; // Use the pre-defined squareFontSize
    } else if (currentImageSrc === imageSrcs.rectangle) {
      // For rectangle images, use a different font size adjustment
      fontSize = rectangleFontSize; // Use the pre-defined rectangleFontSize
    } else {
      // Default font size adjustment in case it's neither square nor rectangle
      // This might not be necessary if you only have square and rectangle images
      fontSize = (canvas.width > canvas.height ? canvas.height : canvas.width) / 15;
    }
  }



  // Set the text position based on the image shape
  function setTextPosition() {
    if (currentImageSrc === imageSrcs.square) {
      textPosition.x = canvas.width / 2;
      textPosition.y = canvas.height / 2 + 120;
    } else {
      textPosition.x = canvas.width / 2;
      textPosition.y = canvas.height - 100;
    }
  }

  // Draw the image and text on the canvas
  function updateText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); // Draw image
    ctx.font = `${fontSize}px ${fontFamily}`; // Set font
    ctx.fillStyle = color; // Set text color
    ctx.textAlign = 'center'; // Center text horizontally
    ctx.textBaseline = 'middle'; // Align text vertically
    ctx.fillText(name, textPosition.x, textPosition.y); // Draw text
  }

  // Event listener for text input
  document.getElementById('nameInput').addEventListener('input', function() {
    name = this.value; // Update name with user input
    updateText(); // Redraw text
  });

  // Event listeners for text color change
  document.querySelectorAll('input[name="textColor"]').forEach((radio) => {
    radio.addEventListener('change', function() {
      color = this.value; // Update text color
      updateText(); // Redraw text
      updateTickMarks(); // Update UI for selected color
    });
  });

  // Event listeners for image shape change
  document.querySelectorAll('input[name="imageShape"]').forEach((radio) => {
    radio.addEventListener('change', function() {
      currentImageSrc = imageSrcs[this.value]; // Update image source
      loadImage(currentImageSrc); // Load new image
      updateRadioSelection(); // Update UI for selected shape
    });
  });

  // Update UI for image shape selection
  function updateRadioSelection() {
    document.querySelectorAll('#imagePicker input[type="radio"]').forEach(radio => {
      let label = document.querySelector(`label[for="${radio.id}"]`);
      if (radio.checked) {
        label.style.backgroundColor = '#e8e8e8'; // Highlight selected
        label.style.borderColor = '#ddd';
      } else {
        label.style.backgroundColor = '#fff'; // Revert others to default
        label.style.borderColor = '#ddd';
      }
    });
  }

  // Get all the radio buttons for text color
  const textColorRadios = document.querySelectorAll('input[type="radio"][name="textColor"]');

  // Update tick marks for selected text color
   function updateTickMarks() {
     document.querySelectorAll('input[name="textColor"]').forEach((radio) => {
       const tickMark = radio.parentElement.querySelector('.tick-mark');
       if (radio.checked) {
         tickMark.style.display = 'block'; // Show tick mark
       } else {
         tickMark.style.display = 'none'; // Hide tick mark
       }
     });
   }


  // Listen for changes on each radio button for text color
  textColorRadios.forEach((radio) => {
    radio.addEventListener('change', updateTickMarks);
  });

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

// Initially call updateRadioSelection to set the correct state at load
updateRadioSelection();

// Initial update
updateTickMarks();

  document.getElementById('downloadBtn').addEventListener('click', handleDownload);

  // Load the specified font and then update the text
  document.fonts.load('10pt "EidFont"').then(updateText);

});
