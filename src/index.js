import './style.css';
import './components/app-bar';
import './components/note-form';
import './components/note-item';

// Menambahkan catatan baru
async function addNoteToAPI(newNote) {
  showLoading();
  try {
    const response = await fetch('https://notes-api.dicoding.dev/v2/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNote),
    });
    if (!response.ok) throw new Error('Failed to add note');
    return response.json();
  } catch (error) {
    console.error('Error adding note:', error);
    alert('Gagal menambahkan catatan.');
  } finally {
    hideLoading();
  }
}

// Ambil catatan yang tidak diarahkan
async function fetchNonArchivedNotes() {
  showLoading();
  try {
    const response = await fetch('https://notes-api.dicoding.dev/v2/notes');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching non-archived notes:', error);
    alert('Gagal memuat catatan.');
    return [];
  } finally {
    hideLoading();
  }
}

// Ambil catatan yang diarsipkan
async function fetchArchivedNotes() {
  showLoading();
  try {
    const response = await fetch('https://notes-api.dicoding.dev/v2/notes/archived');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching archived notes:', error);
    alert('Gagal memuat catatan arsip.');
    return [];
  } finally {
    hideLoading();
  }
}

// Menghapus catatan
async function deleteNoteFromAPI(noteId) {
  showLoading();
  try {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete note');
    return response.json();
  } catch (error) {
    console.error('Error deleting note:', error);
    alert('Gagal menghapus catatan.');
  } finally {
    hideLoading();
  }
}

// Mengarsipkan catatan
async function archiveNoteInAPI(noteId) {
  showLoading();
  try {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}/archive`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to archive note');
    return response.json();
  } catch (error) {
    console.error('Error archiving note:', error);
    alert('Gagal mengarsipkan catatan.');
  } finally {
    hideLoading();
  }
}

// Membatalkan pengarsipan catatan
async function unarchiveNoteInAPI(noteId) {
  showLoading();
  try {
    const response = await fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}/unarchive`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to unarchive note');
    return response.json();
  } catch (error) {
    console.error('Error unarchiving note:', error);
    alert('Gagal membatalkan pengarsipan catatan.');
  } finally {
    hideLoading();
  }
}

// Menampilkan loading
function showLoading() {
  document.getElementById('loading-wrapper').style.display = 'block';
}

// Menyembunyikan loading
function hideLoading() {
  document.getElementById('loading-wrapper').style.display = 'none';
}

// Render notes
async function renderNotes() {
  const nonArchivedNotes = await fetchNonArchivedNotes();
  const archivedNotes = await fetchArchivedNotes();
  const notesList = document.getElementById('notes-list');

  // Hapus konten yang ada
  notesList.innerHTML = `
    <div id="unarchived-notes">
      <h2>Unarchived Notes</h2>
    </div>
    <div id="archived-notes">
      <h2>Archived Notes</h2>
    </div>
  `;

  const unarchivedNotesSection = document.getElementById('unarchived-notes');
  const archivedNotesSection = document.getElementById('archived-notes');

  nonArchivedNotes.forEach(note => {
    const noteItem = document.createElement('note-item');
    noteItem.noteData = note;
    unarchivedNotesSection.appendChild(noteItem);
  });

  archivedNotes.forEach(note => {
    const noteItem = document.createElement('note-item');
    noteItem.noteData = note;
    archivedNotesSection.appendChild(noteItem);
  });
}


// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const notesList = document.getElementById('notes-list');
  const noteForm = document.querySelector('note-form');

  if (!notesList || !noteForm) {
    console.error('Elemen yang diperlukan tidak ditemukan');
    return;
  }

  noteForm.addEventListener('add-note', async (event) => {
    const { title, body } = event.detail;
    await addNoteToAPI({ title, body });
    renderNotes();
  });

  notesList.addEventListener('delete-note', async (event) => {
    const { id } = event.detail;
    await deleteNoteFromAPI(id);
    renderNotes();
  });

  notesList.addEventListener('archive-note', async (event) => {
    const { id } = event.detail;
    await archiveNoteInAPI(id);
    renderNotes();
  });

  notesList.addEventListener('unarchive-note', async (event) => {
    const { id } = event.detail;
    await unarchiveNoteInAPI(id);
    renderNotes();
  });

  renderNotes();
});
