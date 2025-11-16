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
  this.$a4 = document.querySelector(".a4 span");
  this.a4 = parseInt(localStorage.getItem("a4")) || 440;
  this.$a4.innerHTML = this.a4;
};

Application.prototype.start = function () {
  this.$toggle = document.querySelector(".tuner-toggle");
  this.$status = document.querySelector(".status-text");

  this.tuner.onNoteDetected = (note) => {
    if (this.notes.isAutoMode) {
      if (this.lastNote === note.name) {
        this.update(note);
      } else {
        this.lastNote = note.name;
      }
    }
  };

  this.$toggle.addEventListener("click", () => {
    if (this.isRunning) {
      this.stopTuner();
    } else {
      this.startTuner();
    }
  });

  this.$a4.addEventListener("click", () => {
    swal
      .fire({ input: "number", inputValue: this.a4 })
      .then(({ value: a4 }) => {
        if (!parseInt(a4) || a4 === this.a4) {
          return;
        }
        this.a4 = a4;
        this.$a4.innerHTML = a4;
        this.tuner.middleA = a4;
        this.notes.createNotes();
        this.update({
          name: "A",
          frequency: this.a4,
          octave: 4,
          value: 69,
          cents: 0,
        });
        localStorage.setItem("a4", a4);
      });
  });

  this.updateToggleButton();
  this.setStatus("Idle");
};

Application.prototype.update = function (note) {
  this.notes.update(note);
  this.meter.update((note.cents / 50) * 45);
};

Application.prototype.startTuner = function () {
  if (this.isRunning) {
    return;
  }
  this.$toggle.disabled = true;
  this.setStatus("Starting...");
  this.tuner
    .start()
    .then(() => {
      this.isRunning = true;
      this.updateToggleButton();
      this.setStatus("Running");
    })
    .catch((error) => {
      const message = error && error.message ? error.message : String(error);
      this.setStatus("Microphone error");
      swal.fire("Microphone access error", message, "error");
    })
    .finally(() => {
      this.$toggle.disabled = false;
    });
};

Application.prototype.stopTuner = function () {
  if (!this.isRunning) {
    return;
  }
  this.tuner.stop();
  this.isRunning = false;
  this.updateToggleButton();
  this.setStatus("Stopped");
};

Application.prototype.updateToggleButton = function () {
  if (!this.$toggle) {
    return;
  }
  if (this.isRunning) {
    this.$toggle.textContent = "Stop Tuner";
    this.$toggle.classList.add("is-active");
  } else {
    this.$toggle.textContent = "Start Tuner";
    this.$toggle.classList.remove("is-active");
  }
};

Application.prototype.setStatus = function (text) {
  if (this.$status) {
    this.$status.textContent = "Status: " + text;
  }
};

const app = new Application();
app.start();
