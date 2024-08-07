document.addEventListener('DOMContentLoaded', function () {
    const itemForm = document.getElementById('item-form');
    const itemTable = document.getElementById('item-table').getElementsByTagName('tbody')[0];
    const searchBar = document.getElementById('search-bar');
    const totalPriceElem = document.getElementById('total-price');

    itemForm.addEventListener('submit', function (e) {
        e.preventDefault();
        addItem();
    });

    loadItems();

    function loadItems() {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        itemTable.innerHTML = '';

        items.forEach(item => {
            addItemToTable(item);
        });

        updateTotalPrice();
    }

    function addItem() {
        const itemName = document.getElementById('item-name').value.trim();
        const itemPrice = parseFloat(document.getElementById('item-price').value.replace(/\./g, '').replace(',', '.'));
        const itemId = document.getElementById('item-id').value;

        if (itemName === '' || isNaN(itemPrice)) return;

        let items = JSON.parse(localStorage.getItem('items')) || [];

        if (itemId) {
            const index = items.findIndex(item => item.id === itemId);
            items[index] = { id: itemId, name: itemName, price: itemPrice };
        } else {
            const id = new Date().toISOString();
            items.push({ id, name: itemName, price: itemPrice });
        }

        localStorage.setItem('items', JSON.stringify(items));
        loadItems();
        itemForm.reset();
    }

    function addItemToTable(item) {
        const row = itemTable.insertRow();
        row.setAttribute('data-id', item.id);

        const nameCell = row.insertCell(0);
        const priceCell = row.insertCell(1);
        const actionCell = row.insertCell(2);

        nameCell.textContent = item.name;
        priceCell.textContent = formatPrice(item.price);
        actionCell.innerHTML = `
            <button class="update" onclick="editItem('${item.id}')">Edit</button>
            <button class="delete" onclick="deleteItem('${item.id}')">Delete</button>
        `;
    }

    function formatPrice(price) {
        return price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    }

    function editItem(id) {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        const item = items.find(item => item.id === id);

        document.getElementById('item-name').value = item.name;
        document.getElementById('item-price').value = formatPrice(item.price).replace('Rp ', '').replace('.', ',');
        document.getElementById('item-id').value = item.id;
    }

    window.editItem = editItem;

    function deleteItem(id) {
        let items = JSON.parse(localStorage.getItem('items')) || [];
        items = items.filter(item => item.id !== id);
        localStorage.setItem('items', JSON.stringify(items));
        loadItems();
    }

    window.deleteItem = deleteItem;

    function updateTotalPrice() {
        const items = JSON.parse(localStorage.getItem('items')) || [];
        const totalPrice = items.reduce((total, item) => total + item.price, 0);
        totalPriceElem.textContent = formatPrice(totalPrice);
    }

    searchBar.addEventListener('keyup', filterItems);

    function filterItems() {
        const searchTerm = searchBar.value.toLowerCase();
        const rows = itemTable.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const itemName = row.cells[0].textContent.toLowerCase();
            if (itemName.indexOf(searchTerm) === -1) {
                row.style.display = 'none';
            } else {
                row.style.display = '';
            }
        });
    }
});
