const Notes = function (selector, tuner) {
  this.tuner = tuner;
  this.isAutoMode = true;
  this.$root = document.querySelector(selector);
  this.$notesList = this.$root.querySelector(".notes-list");
  this.$frequencyValue = this.$root.querySelector(".frequency-value");
  this.$centsValue = this.$root.querySelector(".cents-value");
  this.noteData = [];
  this.noteIndexMap = {};
  this.$notes = [];
  this.createNotes();
  this.$notesList.addEventListener("touchstart", (event) =>
    event.stopPropagation()
  );
};

Notes.prototype.createNotes = function () {
  this.$notesList.innerHTML = "";
  this.noteData = [];
  this.noteIndexMap = {};

  const minOctave = 1;
  const maxOctave = 8;
  for (let octave = minOctave; octave <= maxOctave; octave += 1) {
    for (let n = 0; n < 12; n += 1) {
      const value = 12 * (octave + 1) + n;
      const data = {
        name: this.tuner.noteStrings[n],
        value: value,
        octave: octave,
        frequency: this.tuner.getStandardFrequency(value),
      };
      this.noteIndexMap[value] = this.noteData.length;
      this.noteData.push(data);
    }
  }

  this.$current = this.createNoteSlot("current");
  this.$notes = [this.$current];

  const self = this;
  this.$notes.forEach(function ($note) {
    $note.addEventListener("click", function () {
      if (self.isAutoMode || !this.dataset.frequency) {
        return;
      }
      const isActive = this.classList.contains("active");
      if (isActive) {
        self.tuner.stopOscillator();
        this.classList.remove("active");
      } else {
        self.tuner.play(this.dataset.frequency);
        const manualNote = {
          value: parseInt(this.dataset.value, 10),
          frequency: parseFloat(this.dataset.frequency),
          cents: 0,
        };
        self.update(manualNote);
      }
    });
  });
};

Notes.prototype.createNoteSlot = function (position) {
  const $note = document.createElement("div");
  $note.className = `note note-${position}`;
  $note.innerHTML = "--";
  this.$notesList.appendChild($note);
  return $note;
};

Notes.prototype.renderNote = function ($note, data) {
  if (!$note) {
    return;
  }
  if (!data) {
    $note.innerHTML = "--";
    $note.dataset.name = "";
    $note.dataset.value = "";
    $note.dataset.octave = "";
    $note.dataset.frequency = "";
    $note.classList.remove("active");
    return;
  }

  $note.dataset.name = data.name;
  $note.dataset.value = data.value;
  $note.dataset.octave = data.octave.toString();
  $note.dataset.frequency = data.frequency;
  const accidental = data.name[1] || "";
  $note.innerHTML =
    data.name[0] +
    '<span class="note-sharp">' +
    accidental +
    "</span>" +
    '<span class="note-octave">' +
    data.octave +
    "</span>";
};

Notes.prototype.active = function ($note) {
  this.clearActive();
  if ($note) {
    $note.classList.add("active");
  }
};

Notes.prototype.clearActive = function () {
  const $active = this.$notesList.querySelector(".active");
  if ($active) {
    $active.classList.remove("active");
  }
};

Notes.prototype.update = function (note) {
  const value = parseInt(note.value, 10);
  if (!Object.prototype.hasOwnProperty.call(this.noteIndexMap, value)) {
    return;
  }

  const index = this.noteIndexMap[value];
  const currentData = this.noteData[index];

  this.renderNote(this.$current, currentData);
  this.active(this.$current);

  if (this.$frequencyValue) {
    this.$frequencyValue.textContent = parseFloat(
      note.frequency
    ).toFixed(1);
  }
  const centsValue = typeof note.cents === "number" ? note.cents : 0;
  if (this.$centsValue) {
    const formatted =
      centsValue > 0
        ? `+${centsValue}`
        : centsValue === 0
        ? "0"
        : `${centsValue}`;
    this.$centsValue.textContent = formatted;
    this.$centsValue.classList.remove("is-flat", "is-sharp");
    if (centsValue > 0) {
      this.$centsValue.classList.add("is-sharp");
    } else if (centsValue < 0) {
      this.$centsValue.classList.add("is-flat");
    }
  }
};

Notes.prototype.toggleAutoMode = function () {
  if (!this.isAutoMode) {
    this.tuner.stopOscillator();
  }
  this.clearActive();
  this.isAutoMode = !this.isAutoMode;
};
