/**
 * @param {string} selector
 * @constructor
 */
const Meter = function (selector) {
  this.$root = document.querySelector(selector);
  // indicator is a small circular knob that moves along the meter
  this.$indicator = this.$root.querySelector(".meter-indicator");
  // parent panel to expose CSS variable for shared indicator color
  this.$panel = this.$root.closest('.panel-body');
  if (this.$panel) {
    this.$panel.style.setProperty('--indicator-color', '#393A3C');
    this.$panel.style.setProperty('--indicator-shadow', 'rgba(57, 58, 60, 0.4)');
    this.$panel.style.setProperty('--indicator-box-shadow', 'rgba(57, 58, 60, 0.6)');
  }
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
      if (this.$panel) {
        this.$panel.style.setProperty('--indicator-color', '#7cffc4');
        this.$panel.style.setProperty('--indicator-shadow', 'rgba(124, 255, 196, 0.45)');
        this.$panel.style.setProperty('--indicator-box-shadow', 'rgba(124, 255, 196, 0.6)');
      }
    } else {
      this.$indicator.classList.remove("in-tune");
      if (this.$panel) {
        this.$panel.style.setProperty('--indicator-color', '#393A3C');
        this.$panel.style.setProperty('--indicator-shadow', 'rgba(57, 58, 60, 0.4)');
        this.$panel.style.setProperty('--indicator-box-shadow', 'rgba(57, 58, 60, 0.6)');
      }
    }
  }
};
