let xValue = null;
let yValue = null;
let zValue = null;

function numberValue(variable, value) {
  if (variable === "x") {
    xValue = value;
  } else if (variable === "y") {
    yValue = value;
  } else if (variable === "z") {
    zValue = value;
  }

  selectedImages(variable, value);
  if (xValue !== null && yValue !== null && zValue !== null) {
    calculateResult();
  }
}

function selectedImages(variable, value) {
  const images = document.querySelectorAll(`#${variable}-variables .img-value`);
  images.forEach((img) => {
    img.classList.remove("selected");
  });
  const selectedImg = document.querySelector(
    `#${variable}-variables img[alt="Value ${value}"]`
  );
  if (selectedImg) {
    selectedImg.parentElement.classList.add("selected");
  }
}

function calculateResult() {
  const x = xValue * 2 + 11;
  const y = zValue * 2 + yValue - 5;
  const z = Math.abs(zValue + yValue - xValue);

  document.getElementById("result1").textContent = x;
  document.getElementById("result2").textContent = y;
  document.getElementById("result3").textContent = z;
}

function openModal(imageElement) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  modalImg.src = imageElement.src;
  modal.classList.remove("hidden");
}

function closeModal() {
  document.getElementById("imageModal").classList.add("hidden");
}
