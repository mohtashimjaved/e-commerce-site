import { updateCartCount } from './navbar.js' // Assuming navbar.js is accessible
import { supabaseclient, session } from './database.js' // Assuming navbar.js is accessible

const form = document.getElementById('buyerInfoForm');
const modalOverlay = document.getElementById('successModalOverlay');

if (form) {
    // return;


    form.addEventListener('submit', handleConfirmOrder);

    async function handleConfirmOrder(event) {
        event.preventDefault(); // Stop default form submission

        if (!validateForm()) {
            // Basic browser validation handles required fields, but this check ensures the process stops if invalid
            return;
        }

        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add items before placing an order.");
            window.location.href = '/index.html'; // Redirect to home or products
            return;
        }

        // 1. Gather User Information
        const buyerInfo = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address1: document.getElementById('address1').value,
            address2: document.getElementById('address2').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            country: document.getElementById('country').value,
        };

        // 2. Calculate Order Total
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
        const orderId = 'ORD-' + Date.now();

        // 3. Create Order Object

        const insertdata = async () => {
            const { data, error } = await supabaseclient
                .from('orders')
                .insert({
                    order_id: JSON.stringify(orderId),
                    buyer_info: JSON.stringify(buyerInfo),
                    items: cartItems,
                    total_amount: parseFloat(total),
                    status: 'Confirmed',
                    user_email: buyerInfo.email
                })
                .select()
            if (error) {
                console.error(error);
                return error;
            }
            console.log(data);
            return data;

        }
        const orderObject = await insertdata()


        localStorage.removeItem('cartItems');
        updateCartCount(); // Function from navbar.js

        showSuccessModal();
    }

    function validateForm() {
        return form.checkValidity();
    }

    function showSuccessModal() {
        modalOverlay.classList.add('show');
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'successModalOverlay') {
            window.location.href = '/index.html';
        }
    });

}