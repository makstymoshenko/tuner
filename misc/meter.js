/**
 * @param {string} selector
 * @constructor
 */
const Meter = function (selector) {
  this.$root = document.querySelector(selector);
  this.$progress = this.$root.querySelector(".meter-line-progress");
};

/**
 * @param {number} percentage - значення від -45 до 45 (переводимо в 0-100%)
 */
Meter.prototype.update = function (percentage) {
  // Переводимо від -45 до 45 градусів у 0-100%
  const normalizedValue = (percentage + 45) / 90 * 100;
  this.$progress.style.width = normalizedValue + "%";
};
