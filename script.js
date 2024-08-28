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

    this.addEventListeners();
    this.renderNotesList();
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
      this.noteTitle.value = "";
      this.noteBody.value = "";
      this.addNoteForm.style.display = "none";
      this.noNotes.style.display = "flex";
      this.addNoteButton.style.display = "flex";
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
        this.noteTitle.value = "";
        this.noteBody.value = "";
        this.addNoteForm.style.display = "none";
        this.addNoteButton.style.display = "flex";
      }
    });

    this.searchInput.addEventListener("input", () => this.renderNotesList());
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
      e.target.closest("li").remove();
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
