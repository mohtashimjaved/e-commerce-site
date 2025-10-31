// cart.js

import { session } from "./database.js";
import { updateCartCount } from "./navbar.js"; // Import the function to update the navbar badge

const cartList = document.getElementById('cart-list');
const emptyCartMessage = document.getElementById('empty-cart-message');
const summaryItemCount = document.getElementById('summary-item-count');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryTotal = document.getElementById('summary-total');

// Assuming your login page is named 'login.html'
const loginRedirectUrl = './login.html'; 

// --- Core Cart Logic ---

function getCart() {
    // Retrieve cart items from local storage
    return JSON.parse(localStorage.getItem('cartItems')) || [];
}

function saveCart(cart) {
    // Save cart items back to local storage
    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateCartCount(); // Update navbar count every time the cart changes
}

function calculateTotals(cart) {
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        // Ensure price is a number before calculation
        subtotal += parseFloat(item.price) * item.quantity; 
        totalItems += item.quantity;
    });

    // Simple total calculation for this example
    const total = subtotal; 

    return { subtotal, total, totalItems };
}

function updateSummary(cart) {
    const { subtotal, total, totalItems } = calculateTotals(cart);
    
    summaryItemCount.textContent = totalItems;
    summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    summaryTotal.textContent = `$${total.toFixed(2)}`;
}

// --- Cart Actions (Quantity & Delete) ---

function handleQuantityChange(id, change) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            // Automatically delete if quantity drops to 0 or less
            handleDeleteItem(id);
            return; 
        }

        saveCart(cart);
        renderCart(); 
    }
}

function handleDeleteItem(id) {
    let cart = getCart();
    // Filter out the item to be deleted
    cart = cart.filter(item => item.id !== id); 
    saveCart(cart);
    renderCart(); 
}

function handleCartAction(event) {
    // Use event delegation to catch clicks on +,-, and delete buttons
    const target = event.target.closest('.qty-btn, .item-delete-btn');
    if (!target) return;

    const id = target.getAttribute('data-id');

    if (target.classList.contains('plus-btn')) {
        handleQuantityChange(id, 1);
    } else if (target.classList.contains('minus-btn')) {
        handleQuantityChange(id, -1);
    } else if (target.classList.contains('item-delete-btn')) {
    
            handleDeleteItem(id);
        
    }
}

// --- Rendering ---

function renderCart() {
    const cart = getCart();
    
    // Remove existing event listener before clearing and re-rendering
    cartList.removeEventListener('click', handleCartAction);
    cartList.innerHTML = ''; 
    
    if (cart.length === 0) {
        // Show empty cart message
        emptyCartMessage.style.display = 'block';
        cartList.appendChild(emptyCartMessage);
    } else {
        emptyCartMessage.style.display = 'none';
        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item cart-item';
            
            const itemTotal = (item.price * item.quantity).toFixed(2);

            listItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="item-pic">
                <div class="item-details">
                    <h5 class="item-title">${item.title}</h5>
                    <p class="item-price">$${item.price.toFixed(2)} x ${item.quantity} = <strong>$${itemTotal}</strong></p>
                </div>
                <div class="item-quantity-control">
                    <button class="qty-btn minus-btn" data-id="${item.id}" aria-label="Decrease quantity"><i class="fas fa-minus"></i></button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="qty-btn plus-btn" data-id="${item.id}" aria-label="Increase quantity"><i class="fas fa-plus"></i></button>
                </div>
                <button class="item-delete-btn" data-id="${item.id}" aria-label="Remove item"><i class="fas fa-trash-alt"></i></button>
            `;
            
            cartList.appendChild(listItem);
        });
        
        // Re-add event listener after rendering
        cartList.addEventListener('click', handleCartAction);
    }
    
    updateSummary(cart);
}

// --- Initialization: Check Login and Load Cart ---

async function checkLoginAndLoadCart() {
    const { session: userSession } = await session();
    
    if (!userSession) {
        // If not logged in, redirect to login page (fulfills requirement)
        window.location.href = loginRedirectUrl;
        return;
    }

    // If logged in, load and render cart
    renderCart();
}

// Run on page load
document.addEventListener('DOMContentLoaded', checkLoginAndLoadCart);