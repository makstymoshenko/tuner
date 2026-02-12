/**
 * @param {string} selector
 * @constructor
 */
const Meter = function (selector) {
  this.$root = document.querySelector(selector);
  // indicator is a small circular knob that moves along the meter
  this.$indicator = this.$root.querySelector(".meter-indicator");
};

/**
 * @param {number} percentage - значення від -45 до 45 (переводимо в 0-100%)
 */
Meter.prototype.update = function (percentage) {
  // Normalize -45..45 -> 0..100
  const normalizedValue = (percentage + 45) / 90 * 100;
  // Clamp to 0..100
  const clamped = Math.max(0, Math.min(100, normalizedValue));
  if (this.$indicator) {
    this.$indicator.style.left = clamped + "%";
    // add a visual 'in-tune' state when very close to center (within ~3 units)
    if (Math.abs(percentage) <= 3) {
      this.$indicator.classList.add("in-tune");
    } else {
      this.$indicator.classList.remove("in-tune");
    }
  }
};
