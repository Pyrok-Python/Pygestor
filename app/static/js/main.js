document.addEventListener('DOMContentLoaded', () => {
    initDragAndDrop();
});

function initDragAndDrop() {
    const cards = document.querySelectorAll('.task-card');
    const lists = document.querySelectorAll('.task-list');
    const columns = document.querySelectorAll('.kanban-column');
    const statuses = ['pending', 'in_progress', 'completed'];

    // Asignar estados a las columnas basados en su índice
    columns.forEach((col, index) => {
        col.setAttribute('data-status', statuses[index]);
        const list = col.querySelector('.task-list');
        if (list) {
            list.setAttribute('data-status', statuses[index]);
        }
    });

    // Configurar cada tarjeta para ser arrastrable
    cards.forEach(card => {
        card.setAttribute('draggable', 'true');

        // Extraer ID de la tarea desde los formularios del botón
        const form = card.querySelector('form');
        if (form) {
            const match = form.action.match(/\/update\/(\d+)/) || form.action.match(/\/delete\/(\d+)/);
            if (match) {
                card.setAttribute('data-task-id', match[1]);
            }
        }

        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', card.getAttribute('data-task-id'));
            e.dataTransfer.effectAllowed = 'move';
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            lists.forEach(list => list.classList.remove('drag-over'));
        });
    });

    // Configurar cada lista como zona de destino para soltar (dropzone)
    lists.forEach(list => {
        list.addEventListener('dragover', (e) => {
            e.preventDefault(); // Permitir el drop
            list.classList.add('drag-over');
        });

        list.addEventListener('dragenter', (e) => {
            e.preventDefault();
            list.classList.add('drag-over');
        });

        list.addEventListener('dragleave', () => {
            list.classList.remove('drag-over');
        });

        list.addEventListener('drop', async (e) => {
            e.preventDefault();
            list.classList.remove('drag-over');

            const taskId = e.dataTransfer.getData('text/plain');
            const newStatus = list.getAttribute('data-status');
            const draggedCard = document.querySelector(`.task-card[data-task-id="${taskId}"]`);

            if (!draggedCard || !newStatus) return;

            // 1. Movimiento optimista instantáneo en el DOM
            const sourceList = draggedCard.parentElement;
            if (sourceList === list) return; // Mismo lugar

            // Mover la tarjeta físicamente
            list.appendChild(draggedCard);

            // Ajustar clases de borde según la columna destino
            draggedCard.classList.remove('border-progress', 'border-completed');
            if (newStatus === 'in_progress') {
                draggedCard.classList.add('border-progress');
            } else if (newStatus === 'completed') {
                draggedCard.classList.add('border-completed');
            }

            // Ocultar estados vacíos de forma visual inmediata
            updateEmptyStates();

            // 2. Enviar actualización al servidor en segundo plano
            try {
                const response = await fetch(`/update/${taskId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (response.ok) {
                    // 3. Cargar la página index en segundo plano para refrescar todos los botones y contadores
                    const freshPageResponse = await fetch('/');
                    if (freshPageResponse.ok) {
                        const htmlText = await freshPageResponse.text();
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlText, 'text/html');
                        
                        // Reemplazar el tablero Kanban por el nuevo tablero renderizado
                        const currentBoard = document.querySelector('.kanban-board');
                        const newBoard = doc.querySelector('.kanban-board');
                        
                        if (currentBoard && newBoard) {
                            currentBoard.innerHTML = newBoard.innerHTML;
                            // Volver a enlazar los listeners en el nuevo DOM
                            initDragAndDrop();
                        }
                    }
                } else {
                    console.error('Error al actualizar el estado de la tarea en el servidor');
                    window.location.reload(); // Revertir si hay error
                }
            } catch (err) {
                console.error('Error de red:', err);
                window.location.reload(); // Revertir si hay error
            }
        });
    });
}

function updateEmptyStates() {
    const lists = document.querySelectorAll('.task-list');
    lists.forEach(list => {
        // Contamos las tarjetas de tareas reales dentro
        const cards = list.querySelectorAll('.task-card');
        let emptyState = list.querySelector('.empty-state');
        
        if (cards.length > 0 && emptyState) {
            emptyState.style.display = 'none';
        } else if (cards.length === 0) {
            if (!emptyState) {
                // Si no existe el mensaje, lo creamos
                emptyState = document.createElement('p');
                emptyState.className = 'empty-state';
                const status = list.getAttribute('data-status');
                if (status === 'pending') emptyState.innerText = 'No pending tasks.';
                else if (status === 'in_progress') emptyState.innerText = 'Nothing in progress.';
                else if (status === 'completed') emptyState.innerText = 'None completed yet.';
                list.appendChild(emptyState);
            } else {
                emptyState.style.display = 'block';
            }
        }
    });

    // Actualizar contadores rápidos visuales
    const columns = document.querySelectorAll('.kanban-column');
    columns.forEach(col => {
        const badge = col.querySelector('.badge');
        const list = col.querySelector('.task-list');
        if (badge && list) {
            badge.innerText = list.querySelectorAll('.task-card').length;
        }
    });
}
