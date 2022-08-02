// NOTE: separate js file for notes page.
// Everything here is specifically used directly on the notes page.
// Helps scope the logic to just the page and
// requires less context switching between pages.
// (i.e. removes the necessity for window.location.pathname === '/notes')

const noteTitle = document.querySelector(".note-title");
const noteText = document.querySelector(".note-textarea");
const saveNoteBtn = document.querySelector(".save-note");
const newNoteBtn = document.querySelector(".new-note");

// NOTE: since save button's styles are specific,
// could be better to create a handler to execute it's styling
// instead of creating a reusable method since in this case,
// it is only used for the save button and not anything else.
// This makes the method more direct and explicit.
const initSaveNoteButtonHandler = () => ({
  show: () => (saveNoteBtn.style.display = "inline"),
  hide: () => (saveNoteBtn.style.display = "none"),
});
const handleSaveNoteButton = initSaveNoteButtonHandler();

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// NOTE: groups all api calls/methods under a single "library"
// helps explicitly show when you are making api calls to your server
// so the usage will look like `api.CALL()` instead of trying to
// understand what `getNotes()` does
const api = {
  getNotes: async () => {
    const response = await fetch("/api/notes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const notes = await response.json();
    return notes;
  },
  saveNote: async (note) => {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    });
    return response;
  },
  deleteNote: async (id) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  },
};

const renderActiveNote = () => {
  // NOTE: example of explicit save button method down this document.
  // helps ties context to what it is without scrolling back up
  handleSaveNoteButton.hide();

  if (activeNote.id) {
    noteTitle.setAttribute("readonly", true);
    noteText.setAttribute("readonly", true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute("readonly");
    noteText.removeAttribute("readonly");
    noteTitle.value = "";
    noteText.value = "";
  }
};

const handleNoteSave = async () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };

  // NOTE: First API call within the doc!
  // just by assigning api.DO_SOMETHING() helps
  // paint a clear picture of calls being made within the doc.
  // async + await helps cleans up the doc
  // by flattening out the execution :)
  await api.saveNote(newNote);
  renderNotes();
  renderActiveNote();
};

// Delete the clicked note
const handleNoteDelete = async (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  // NOTE: since we are already parsing and assigning it to note,
  // just go full force and stick it into a single line rather than
  // the 2 part variable assignment like before
  const note = JSON.parse(e.target.parentElement.getAttribute("data-note"));

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  await api.deleteNote(note.id);
  renderNotes();
  renderActiveNote();
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute("data-note"));
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    handleSaveNoteButton.hide();
  } else {
    handleSaveNoteButton.show();
  }
};

// NOTE: Abstracted this method out of the render to
// reduce the bloat within the render method
// since the render method is already taking a lot of
// responsibility for rendering the notes.
// Also, I like the default value of `delBtn = true`. A+.
// Returns HTML element with or without a delete button
const createNoteListItem = (text, delBtn = true) => {
  const liEl = document.createElement("li");
  liEl.classList.add("list-group-item");

  const spanEl = document.createElement("span");
  spanEl.classList.add("list-item-title");
  spanEl.innerText = text;
  spanEl.addEventListener("click", handleNoteView);

  liEl.append(spanEl);

  if (delBtn) {
    const delBtnEl = document.createElement("i");
    delBtnEl.classList.add(
      "fas",
      "fa-trash-alt",
      "float-right",
      "text-danger",
      "delete-note"
    );
    delBtnEl.addEventListener("click", handleNoteDelete);

    liEl.append(delBtnEl);
  }

  return liEl;
};

// Gets notes from the db and renders them to the sidebar
const renderNotes = async () => {
  // NOTE: here, we can systematically reorder and
  // condense this render method's responsbility,
  // subjectively making it a bit easier to read and comprehend.
  let noteListItems = [];

  const jsonNotes = await api.getNotes();

  if (jsonNotes.length === 0) {
    noteListItems.push(createNoteListItem("No saved Notes", false));
  }

  jsonNotes.forEach((note) => {
    const li = createNoteListItem(note.title);
    li.dataset.note = JSON.stringify(note);
    noteListItems.push(li);
  });

  const noteList = document.querySelectorAll(".list-container .list-group");
  noteList.forEach((el) => (el.innerHTML = ""));
  noteListItems.forEach((note) => noteList[0].append(note));
};

saveNoteBtn.addEventListener("click", handleNoteSave);
newNoteBtn.addEventListener("click", handleNewNoteView);
noteTitle.addEventListener("keyup", handleRenderSaveBtn);
noteText.addEventListener("keyup", handleRenderSaveBtn);

renderNotes();
