// Select DOM elements
const canvas = document.getElementById("diffractionCanvas");
const ctx = canvas.getContext("2d");

const wavelengthInput = document.getElementById("wavelength");
const numSlitsInput = document.getElementById("numSlits");

const wavelengthValue = document.getElementById("wavelengthValue");
const numSlitsValue = document.getElementById("numSlitsValue");

const minWavelengthValue = document.getElementById("minWavelengthValue");
const maxWavelengthValue = document.getElementById("maxWavelengthValue");
const slitSpacingValue = document.getElementById("slitSpacingValue");
const laserSlitDistanceValue = document.getElementById("laserSlitDistanceValue");
const slitWidthValue = document.getElementById("slitWidthValue");
const canvasDimensionsValue = document.getElementById("canvasDimensionsValue");

// Constants used in the simulation
const MIN_WAVELENGTH = 400;  // Minimum wavelength (nm)
const MAX_WAVELENGTH = 700;  // Maximum wavelength (nm)
const SLIT_SPACING = 10;     // Slit spacing (arbitrary units)
const CANVAS_WIDTH = 800;    // Canvas width (px)
const CANVAS_HEIGHT = 400;   // Canvas height (px)
const SLIT_HEIGHT = 200;     // Height of the diffraction pattern (px)
const LASER_SLIT_DISTANCE = 0.5; // Distance between laser and slit (meters)
const SLIT_WIDTH = 1.5;     // Slit width (μm)

// Convert wavelength (350-750 nm) to RGB color
function wavelengthToRGB(wavelength) {
  let r, g, b;

  if (wavelength >= 350 && wavelength <= 440) {
    r = -(wavelength - 440) / (440 - 350);
    g = 0;
    b = 1;
  } else if (wavelength > 440 && wavelength <= 490) {
    r = 0;
    g = (wavelength - 440) / (490 - 440);
    b = 1;
  } else if (wavelength > 490 && wavelength <= 510) {
    r = 0;
    g = 1;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength > 510 && wavelength <= 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1;
    b = 0;
  } else if (wavelength > 580 && wavelength <= 645) {
    r = 1;
    g = -(wavelength - 645) / (645 - 580);
    b = 0;
  } else if (wavelength > 645 && wavelength <= 750) {
    r = 1;
    g = 0;
    b = 0;
  } else {
    r = 0;
    g = 0;
    b = 0;
  }

  // Scale values to 0–255
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

// Draw diffraction pattern
function drawDiffraction() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const wavelength = parseFloat(wavelengthInput.value); // nm
  const numSlits = parseInt(numSlitsInput.value); // Number of slits

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  const laserColor = wavelengthToRGB(wavelength);

  // Calculate diffraction pattern
  for (let x = 0; x < canvas.width; x++) {
    let intensity = 0;
    const relativeX = (x - centerX) / canvas.width;

    for (let n = 0; n < numSlits; n++) {
      // Phase shift between slits based on distance
      const phaseShift = (2 * Math.PI * relativeX * n) / (wavelength / 1000); // Normalize wavelength
      intensity += Math.cos(phaseShift);
    }

    intensity = Math.pow(intensity / numSlits, 2); // Normalize intensity
    const colorIntensity = Math.round(intensity * 255);

    // Use dynamic laser color
    const [r, g, b] = laserColor
      .slice(4, -1)
      .split(",")
      .map(Number);

    const finalColor = `rgb(${Math.round(r * (colorIntensity / 255))}, 
                            ${Math.round(g * (colorIntensity / 255))}, 
                            ${Math.round(b * (colorIntensity / 255))})`;

    ctx.fillStyle = finalColor;
    ctx.fillRect(x, centerY - SLIT_HEIGHT / 2, 1, SLIT_HEIGHT);
  }
}

// Update the displayed values and redraw canvas
function update() {
  wavelengthValue.textContent = `${wavelengthInput.value} nm`;
  numSlitsValue.textContent = numSlitsInput.value;

  slitSpacingValue.textContent = SLIT_SPACING;
  laserSlitDistanceValue.textContent = `${LASER_SLIT_DISTANCE} m`;
  slitWidthValue.textContent = SLIT_WIDTH;
  canvasDimensionsValue.textContent = `${CANVAS_WIDTH} x ${CANVAS_HEIGHT} px`;

  drawDiffraction();
}

// Reset simulation to default values
function resetSimulation() {
  wavelengthInput.value = 660; // Default wavelength (green)
  numSlitsInput.value = 2;    // Default slits

  update();
}

// Add event listeners to controls
wavelengthInput.addEventListener("input", update);
numSlitsInput.addEventListener("input", update);

// Initial rendering
update();
