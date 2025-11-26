import { signoutfunc, session } from "./database.js";
// document.addEventListener('DOMContentLoaded', () => {

const menuToggle = document?.getElementById('menu-toggle');
const offCanvasMenu = document?.getElementById('off-canvas-menu');
const closeMenu = document?.getElementById('close-main-menu');
const overlay = document?.getElementById('overlay');

const userNameElement = document?.getElementById('user-name');
const userEmailElement = document?.getElementById('user-email');
const profileLi = document?.getElementById('profile-li');
const ordersLi = document?.getElementById('orders-li');

const loginLink = document?.getElementById('login-link');
const signoutLink = document?.getElementById('signout-link');


const searchToggle = document?.getElementById('search-toggle');
const searchBarSection = document?.getElementById('search-bar-section');

const cartCountElement = document?.getElementById('cart-count');

let isLoggedIn = false;

function toggleNav() {
    offCanvasMenu.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = offCanvasMenu.classList.contains('open') ? 'hidden' : '';
}

function closeNav() {
    offCanvasMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function openSearch() {
    searchBarSection.classList.add('active');
    searchBarSection.classList.add('animate__flipInX');
    searchBarSection.classList.remove('animate__flipOutX');
}

function closeSearch() {
    searchBarSection.classList.remove('animate__flipInX');
    searchBarSection.classList.add('animate__flipOutX');
    setTimeout(() =>
        searchBarSection.classList.remove('active'),
        500
    )

}

menuToggle?.addEventListener('click', toggleNav);
closeMenu?.addEventListener('click', closeNav);
overlay?.addEventListener('click', closeNav);

offCanvasMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

searchToggle?.addEventListener('click', openSearch);
document.getElementById('close-search')?.addEventListener('click', closeSearch);


const checkSession = async () => {
    const getSession = await session();
    if (getSession.session) {
        const name =  getSession.session.user.user_metadata.name
        const email = getSession.session.user.user_metadata.email
        if(userNameElement && userEmailElement){
            userNameElement.innerText = name;
            userNameElement.style.textTransform = "capitalize"
            userEmailElement.innerText = email;
            
            profileLi.style.display = 'block';
            ordersLi.style.display = 'block';
            
            signoutLink.style.display = 'flex';
            loginLink.style.display = 'none';
        }
    }
    else {
        profileLi.style.display = 'none';
        ordersLi.style.display = 'none';
        
        signoutLink.style.display = 'none';
        loginLink.style.display = 'flex';
    }
}
checkSession()
document.getElementById("signout-link")?.addEventListener('click', signoutfunc)

export function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    // Sum the quantity of all items
    const totalItems = cart.length;
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
        // Show the badge only if there are items in the cart
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none'; 
    }
}
updateCartCount()
