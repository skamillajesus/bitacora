document.addEventListener('DOMContentLoaded', function() {
    loadTableData();

    document.getElementById('logForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Obtener los valores de los campos del formulario
        const fecha = document.getElementById('fecha').value;
        const maquina = document.getElementById('maquina').value;
        const falla = document.getElementById('falla').value;

        // Formatear la fecha a "dd-mm-yyyy"
        const formattedDate = formatDate(fecha);

        // Crear un nuevo registro
        const newRecord = { fecha: formattedDate, maquina, falla, solucion: '', estado: 'Pendiente' };
        saveRecord(newRecord);
        refreshTable();

        // Limpiar el formulario
        document.getElementById('logForm').reset();
    });

    document.getElementById('searchInput').addEventListener('input', refreshTable);
});

function loadTableData() {
    refreshTable();
}

function addRecordToTable(record) {
    const tableBody = document.getElementById('logTableBody');
    const newRow = tableBody.insertRow();

    const cellFecha = newRow.insertCell(0);
    const cellMaquina = newRow.insertCell(1);
    const cellFalla = newRow.insertCell(2);
    const cellSolucion = newRow.insertCell(3);
    const cellEstado = newRow.insertCell(4);

    cellFecha.textContent = record.fecha;
    cellMaquina.textContent = record.maquina;
    cellFalla.textContent = record.falla;

    const solucionInput = document.createElement('textarea');
    solucionInput.classList.add('solution');
    solucionInput.value = record.solucion;
    solucionInput.addEventListener('input', function() {
        record.solucion = solucionInput.value;
        if (solucionInput.value.trim() !== '') {
            record.estado = 'Completado';
            estadoButton.textContent = 'Completado';
            estadoButton.classList.remove('pending');
            estadoButton.classList.add('completed');
        } else {
            record.estado = 'Pendiente';
            estadoButton.textContent = 'Pendiente';
            estadoButton.classList.remove('completed');
            estadoButton.classList.add('pending');
        }
        updateRecord(record);
    });
    cellSolucion.appendChild(solucionInput);

    const estadoButton = document.createElement('button');
    estadoButton.textContent = record.estado;
    estadoButton.classList.add(record.estado === 'Pendiente' ? 'pending' : 'completed');
    cellEstado.appendChild(estadoButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Borrar';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', function() {
        deleteRecord(record);
        refreshTable();
    });
    cellEstado.appendChild(deleteButton);
}

function getRecords() {
    const records = localStorage.getItem('bitacoraRecords');
    return records ? JSON.parse(records) : [];
}

function saveRecord(record) {
    const records = getRecords();
    records.push(record);
    localStorage.setItem('bitacoraRecords', JSON.stringify(records));
}

function updateRecord(updatedRecord) {
    let records = getRecords();
    records = records.map(record => 
        record.fecha === updatedRecord.fecha && 
        record.maquina === updatedRecord.maquina && 
        record.falla === updatedRecord.falla ? updatedRecord : record
    );
    localStorage.setItem('bitacoraRecords', JSON.stringify(records));
}

function deleteRecord(recordToDelete) {
    let records = getRecords();
    records = records.filter(record => 
        record.fecha !== recordToDelete.fecha || 
        record.maquina !== recordToDelete.maquina || 
        record.falla !== recordToDelete.falla
    );
    localStorage.setItem('bitacoraRecords', JSON.stringify(records));
}

function refreshTable() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const records = getRecords();
    const tableBody = document.getElementById('logTableBody');

    tableBody.innerHTML = '';

    records.forEach(record => {
        const match = record.fecha.toLowerCase().includes(searchValue) ||
            record.maquina.toLowerCase().includes(searchValue) ||
            record.falla.toLowerCase().includes(searchValue) ||
            record.solucion.toLowerCase().includes(searchValue);

        if (match) {
            addRecordToTable(record);
        }
    });
}

function formatDate(date) {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}

