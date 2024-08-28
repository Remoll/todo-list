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
        };
        this.notes.push(newNote);
        this.renderNote(newNote);
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

    this.cancelNoteRemoveButton.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  renderNote(note) {
    const template = document
      .getElementById("note-template")
      .content.cloneNode(true);
    template.querySelector("#note-title").textContent = note.title;
    template.querySelector("#note-body").textContent = note.body;
    template.querySelector("#note-date").textContent = this.getFormatedDate(
      note.date
    );

    const deleteButton = template.querySelector("#remove-note");
    deleteButton.addEventListener("click", (e) => {
      modal.style.display = "block";

      const confirmRemove = () => {
        e.target.closest("li").remove();
        modal.style.display = "none";
        this.confirmNoteRemoveButton.removeEventListener(
          "click",
          confirmRemove
        );
      };

      this.confirmNoteRemoveButton.addEventListener("click", confirmRemove);
    });

    document.getElementById("noteList").prepend(template);
  }

  renderNotesList() {
    const notesTemplates = this.notes.map(() => {
      const template = document
        .getElementById("note-template")
        .content.cloneNode(true);

      template.querySelector("input").value = note.title;
      template.querySelector("textarea").value = note.body;

      const deleteButton = template.querySelector(".delete-note");
      deleteButton.addEventListener("click", (e) => {
        e.target.closest("li").remove();
      });
    });

    const fragment = document.createDocumentFragment();

    notesTemplates.forEach((note) => {
      const template = document
        .getElementById("note-template")
        .content.cloneNode(true);

      template.querySelector("input").value = note.title;
      template.querySelector("textarea").value = note.body;
      //   template.querySelector("textarea").value = note.date;

      fragment.appendChild(template);
    });

    document.getElementById("noteList").appendChild(fragment);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new NotesApp();
});
