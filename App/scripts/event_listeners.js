const rangeSlider = document.getElementById("rs-range-line");
const rangeBullet = document.getElementById("rs-bullet");
rangeSlider.addEventListener("input", showSliderValue, false);
function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = (rangeSlider.value /rangeSlider.max);
  rangeBullet.style.left = (bulletPosition * 578) + "px";
}

