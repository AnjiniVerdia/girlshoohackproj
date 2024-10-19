// DOM Elements
const form = document.getElementById('grocery-form');
const groceryTableBody = document.querySelector('#grocery-table tbody');
const pantryTableBody = document.querySelector('#pantry-table tbody');
const budgetInput = document.getElementById('budget');
const remainingBudgetDisplay = document.getElementById('remaining-budget');

// Variables
let groceries = [];
let pantry = [];
let totalCost = 0;
let remainingBudget = 0;

// Handle form submission
// Handle form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get values from input fields
    const itemName = document.getElementById('item-name').value;
    const category = document.getElementById('category').value;
    const quantity = parseInt(document.getElementById('quantity').value);   
    const price = parseFloat(document.getElementById('price').value);

    // Check if input is valid
    if (!itemName || !category || isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
        alert("Please enter valid values for all fields.");
        return;
    }

    // Calculate total cost for the item
    const totalItemCost = quantity * price;
    
    // Add item to the grocery list
    groceries.push({ itemName, category, quantity, price, totalItemCost });
    
    // Update budget
    updateBudget(totalItemCost);
    
    // Add item to the table
    addGroceryToTable({ itemName, category, quantity, totalItemCost });

    //update pantry table 
    updatePantryTable();

    // Clear the form
    form.reset();
});


// Add grocery item to the table
function addGroceryToTable(item) {
    // sanity check
    if (!item || !item.itemName || !item.category || isNaN(item.quantity) || isNaN(item.totalItemCost)) {
        console.error('Invalid item object passed to addGroceryToTable');
        return;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.itemName}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>$${item.totalItemCost.toFixed(2)}</td>
        <td><button class="check-off">Check Off</button></td>
    `;
    groceryTableBody.appendChild(row);
    console.log("Grocery list array:", groceries);

    // Handle check-off button click
    row.querySelector('.check-off').addEventListener('click', function() {
        checkOffItem(item);
        row.remove();
    });
}


// Check off item and update pantry inventory
function checkOffItem(item) {
    // Update pantry inventory
    let existingItem = pantry.find(p => p.itemName === item.itemName);

    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        pantry.push({ itemName: item.itemName, category: item.category, quantity: item.quantity });
    }
    
    updatePantryTable();
}

// Update pantry table
function updatePantryTable() {
    pantryTableBody.innerHTML = '';  // Clear existing table

    pantry.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.itemName}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
        `;
        pantryTableBody.appendChild(row);
    });
}

// Update budget
budgetInput.addEventListener('input', function() {
    remainingBudget = parseFloat(budgetInput.value) - totalCost;
    remainingBudgetDisplay.textContent = remainingBudget.toFixed(2);
});

function updateBudget(itemCost) {
    totalCost += itemCost;
    remainingBudget = parseFloat(budgetInput.value) - totalCost;
    remainingBudgetDisplay.textContent = remainingBudget.toFixed(2);
}
