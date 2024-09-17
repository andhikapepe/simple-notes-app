class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set noteData(data) {
        this.data = data;
        this.render();
    }

    render() {
        const { id, title, body, archived } = this.data;
        this.shadowRoot.innerHTML = `
            <style>
                .note {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 15px;
                    background-color: #ffffff;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    max-width: 500px;
                    margin: 10px auto;
                    box-sizing: border-box;
                }
                .title {
                    font-size: 1.2em;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #333;
                }
                .body {
                    font-size: 1em;
                    color: #555;
                    line-height: 1.5;
                    margin: 0;
                }
                .actions {
                    margin-top: 10px;
                }
                .delete-button,
                .archive-button,
                .unarchive-button {
                    background-color: #e74c3c;
                    border: none;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.9em;
                    margin-right: 5px;
                }
                .archive-button {
                    background-color: #f39c12;
                }
                .unarchive-button {
                    background-color: #2ecc71;
                }
            </style>
            <div class="note">
                <div class="title">${title}</div>
                <div class="body">${body}</div>
                <div class="actions">
                    <button class="delete-button">Delete</button>
                    ${archived
                        ? '<button class="unarchive-button">Unarchive</button>'
                        : '<button class="archive-button">Archive</button>'
                    }
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('.delete-button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('delete-note', {
                detail: { id },
                bubbles: true,
                composed: true
            }));
        });

        if (archived) {
            this.shadowRoot.querySelector('.unarchive-button').addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('unarchive-note', {
                    detail: { id },
                    bubbles: true,
                    composed: true
                }));
            });
        } else {
            this.shadowRoot.querySelector('.archive-button').addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('archive-note', {
                    detail: { id },
                    bubbles: true,
                    composed: true
                }));
            });
        }
    }

    connectedCallback() {
        const dataAttr = this.getAttribute('data');
        if (dataAttr) {
            try {
                this.noteData = JSON.parse(dataAttr);
            } catch (e) {
                console.error('Invalid JSON in data attribute', e);
            }
        }
    }
}

if (!customElements.get('note-item')) {
    customElements.define('note-item', NoteItem);
}
