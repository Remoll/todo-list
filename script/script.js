class NotesApp {
  constructor() {
    this.notes = [];
    this.noteList = document.getElementById("noteList");
    this.searchInput = document.getElementById("search");
    this.addNoteButton = document.getElementById("addNote");
    this.addFirstNoteButton = document.getElementById("addFirstNote");
    this.cancelNoteButton = document.getElementById("cancelNote");
    this.saveNoteButton = document.getElementById("save-note");
    this.noNotes = document.getElementById("no-notes");
    this.noteTitle = document.getElementById("note-title");
    this.noteBody = document.getElementById("note-body");
    this.addNoteForm = document.querySelector(".add-note-form");
    this.noteFormBody = document.getElementById("note-body");
    this.modal = document.getElementById("modal");
    this.confirmNoteRemoveButton = document.getElementById("confirm-delete");
    this.cancelNoteRemoveButton = document.getElementById("cancel-delete");

    this.addEventListeners();
    this.renderNotesList();
  }

  resetForm() {
    this.noteTitle.value = "Untitled Note";
    this.noteBody.value = "";
    this.saveNoteButton.classList.remove("show");
  }

  getFormatedDate(dateString) {
    const date = new Date(dateString);

    const options = { month: "short" };
    const month = date.toLocaleString("en-US", options);

    const day = date.getDate();

    const formattedDate = `${month} ${day}`;

    return formattedDate;
  }

  getNewId() {
    return Math.random().toString(16).slice(2);
  }

  addEventListeners() {
    this.addNoteButton.addEventListener("click", () => {
      this.addNoteForm.style.display = "flex";
      this.noNotes.style.display = "none";
      this.addNoteButton.style.display = "none";
    });

    this.addFirstNoteButton.addEventListener("click", () => {
      this.addNoteForm.style.display = "flex";
      this.noNotes.style.display = "none";
      this.addNoteButton.style.display = "none";
    });

    this.cancelNoteButton.addEventListener("click", () => {
      this.resetForm();
      this.addNoteForm.style.display = "none";

      if (this.notes.length > 0) {
        this.addNoteButton.style.display = "flex";
      } else {
        this.noNotes.style.display = "flex";
      }
    });

    this.saveNoteButton.addEventListener("click", () => {
      if (
        this.noteTitle.value.trim() !== "" ||
        this.noteBody.value.trim() !== ""
      ) {
        const newNote = {
          title: this.noteTitle.value,
          body: this.noteBody.value,
          date: new Date(),
          id: this.getNewId(),
        };
        this.notes.push(newNote);
        this.renderNotesList();
        this.resetForm();
        this.addNoteForm.style.display = "none";
        this.addNoteButton.style.display = "flex";
      }
    });

    this.searchInput.addEventListener("input", () => this.renderNotesList());

    this.noteFormBody.addEventListener("input", () => {
      if (this.noteFormBody.value.trim() !== "") {
        this.saveNoteButton.classList.add("show");
      } else {
        this.saveNoteButton.classList.remove("show");
      }
    });

    this.noteBody.addEventListener("focus", function () {
      this.select();
    });

    this.noteTitle.addEventListener("focus", function () {
      this.select();
    });
  }

  removeNoteFromArray(id) {
    const index = this.notes.findIndex((note) => note.id === id);

    if (index !== -1) {
      this.notes.splice(index, 1);
    }
  }

  getNoteTemplateAndListeners(note) {
    const template = document
      .getElementById("note-template")
      .content.cloneNode(true);

    template.querySelector("#note-title").textContent = note.title;
    template.querySelector("#note-body").textContent = note.body;
    template.querySelector("#note-date").textContent = this.getFormatedDate(
      note.date
    );

    const deleteButton = template.querySelector("#remove-note");

    deleteButton.addEventListener("click", () => {
      modal.style.display = "block";

      const cancelRemove = () => {
        modal.style.display = "none";
        this.confirmNoteRemoveButton.removeEventListener(
          "click",
          confirmRemove
        );
        this.confirmNoteRemoveButton.removeEventListener("click", cancelRemove);
      };

      const confirmRemove = () => {
        this.removeNoteFromArray(note.id);
        modal.style.display = "none";
        if (this.notes.length > 0) {
          this.addNoteButton.style.display = "flex";
          this.noNotes.style.display = "none";
        } else {
          this.addNoteButton.style.display = "none";
          this.noNotes.style.display = "flex";
        }
        this.confirmNoteRemoveButton.removeEventListener(
          "click",
          confirmRemove
        );
        this.confirmNoteRemoveButton.removeEventListener("click", cancelRemove);
        this.renderNotesList();
      };

      this.cancelNoteRemoveButton.addEventListener("click", cancelRemove);

      this.confirmNoteRemoveButton.addEventListener("click", confirmRemove);
    });

    const editButton = template.querySelector("#edit-note");

    const editNote = () => {
      this.renderNotesList(note.id);
      this.addNoteButton.style.display = "none";
      this.confirmNoteRemoveButton.removeEventListener("click", editNote);
    };

    editButton.addEventListener("click", editNote);

    return template;
  }

  getEditNoteTemplateAndListeners(note) {
    const template = document
      .getElementById("edit-note-template")
      .content.cloneNode(true);

    const noteTitleElement = template.querySelector("#note-title");
    const noteBodyElement = template.querySelector("#note-body");

    noteTitleElement.value = note.title;
    noteBodyElement.value = note.body;

    const confirmEdit = () => {
      const index = this.notes.findIndex((item) => note.id === item.id);
      if (index !== -1) {
        this.notes[index] = {
          ...this.notes[index],
          title: noteTitleElement.value,
          body: noteBodyElement.value,
        };
      }
      this.renderNotesList();
      this.addNoteButton.style.display = "flex";
      this.confirmNoteRemoveButton.removeEventListener("click", cancelEdit);
      this.confirmNoteRemoveButton.removeEventListener("click", confirmEdit);
    };

    const cancelEdit = () => {
      this.renderNotesList();
      this.addNoteButton.style.display = "flex";
      this.confirmNoteRemoveButton.removeEventListener("click", cancelEdit);
      this.confirmNoteRemoveButton.removeEventListener("click", confirmEdit);
    };

    template
      .querySelector("#confirm-note-edit")
      .addEventListener("click", confirmEdit);

    template
      .querySelector("#cancel-note-edit")
      .addEventListener("click", cancelEdit);

    template
      .querySelector("#note-title")
      .addEventListener("focus", function () {
        this.select();
      });

    template.querySelector("#note-body").addEventListener("focus", function () {
      this.select();
    });

    return template;
  }

  renderNotesList(editedNoteId = undefined) {
    const filteredNotes = [...this.notes]
      .reverse()
      .filter(
        (note) =>
          note.title
            .toLowerCase()
            .includes(this.searchInput.value.toLowerCase()) ||
          note.body.toLowerCase().includes(this.searchInput.value.toLowerCase())
      );

    const notesTemplates = filteredNotes.map((note) => {
      return editedNoteId === note.id
        ? this.getEditNoteTemplateAndListeners(note)
        : this.getNoteTemplateAndListeners(note);
    });

    const fragment = document.createDocumentFragment();

    notesTemplates.forEach((template) => {
      fragment.appendChild(template);
    });

    document.getElementById("noteList").replaceChildren(fragment);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new NotesApp();
});
