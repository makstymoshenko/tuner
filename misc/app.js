const Application = function () {
  this.initA4();
  this.tuner = new Tuner(this.a4);
  this.notes = new Notes(".notes", this.tuner);
  this.meter = new Meter(".meter");
  this.isRunning = false;
  this.update({
    name: "A",
    frequency: this.a4,
    octave: 4,
    value: 69,
    cents: 0,
  });
};

Application.prototype.initA4 = function () {
  this.$a4Display = document.querySelector(".a4-display");
  this.a4 = parseInt(localStorage.getItem("a4")) || 440;
  this.$a4Display.innerHTML = this.a4;
  this.a4Min = 415;
  this.a4Max = 466;
};

Application.prototype.start = function () {
  this.tuner.onNoteDetected = (note) => {
    if (this.notes.isAutoMode) {
      if (this.lastNote === note.name) {
        this.update(note);
      } else {
        this.lastNote = note.name;
      }
    }
  };

  // A4 buttons removed — no event handlers required

  // Обробник клику/тапу по всьому екрану для включення/виключення тюнера
  const handleToggleTuner = () => {
    if (this.isRunning) {
      this.stopTuner();
    } else {
      this.startTuner();
    }
  };

  // Prevent clicks or touches on the A4 area from toggling the tuner
  const $a4Control = document.querySelector('.a4-control');
  if ($a4Control) {
    $a4Control.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    $a4Control.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    });
  }

  document.addEventListener("click", (e) => {
    // Ігноруємо клік на кнопки A4
    if (e.target.classList.contains("a4-btn") || e.target.closest(".a4-control")) {
      return;
    }
    // Ігноруємо клік на елементи діалогів та модальних вікон
    if (document.querySelector(".swal2-container")) {
      return;
    }
    handleToggleTuner();
  });

  document.addEventListener("touchstart", (e) => {
    // Ігноруємо тап на кнопки A4
    if (e.target.classList.contains("a4-btn") || e.target.closest(".a4-control")) {
      return;
    }
    // Ігноруємо тап на елементи діалогів та модальних вікон
    if (document.querySelector(".swal2-container")) {
      return;
    }
    handleToggleTuner();
  });

  this.updateToggleButton();
};

Application.prototype.update = function (note) {
  this.notes.update(note);
  this.meter.update((note.cents / 50) * 45);
};

Application.prototype.startTuner = function () {
  if (this.isRunning) {
    return;
  }
  this.tuner
    .start()
    .then(() => {
      this.isRunning = true;
    })
    .catch((error) => {
      const message = error && error.message ? error.message : String(error);
      swal.fire("Microphone access error", message, "error");
    });
};

Application.prototype.stopTuner = function () {
  if (!this.isRunning) {
    return;
  }
  this.tuner.stop();
  this.isRunning = false;
};

const app = new Application();
app.start();
