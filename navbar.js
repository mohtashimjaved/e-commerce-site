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

function initSearch() {
    const searchInput = document.querySelector(".search-input");
    const searchButton = document.getElementById("search-button"); // Ensure you have a button or icon with this ID inside your search bar

    if (searchInput) {
        // Trigger search on "Enter" key press
        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                performSearch(searchInput.value);
            }
        });
    }

    if (searchButton) {
        // Trigger search on click
        searchButton.addEventListener("click", function () {
            performSearch(searchInput.value);
        });
    }
}

function performSearch(query) {
    if (query && query.trim() !== "") {
        // Redirect to search.html with the query as a parameter
        window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
    }
}

// Initialize the listener
initSearch();

const checkSession = async () => {
    const getSession = await session();
    if (getSession.session) {
        const name = getSession.session.user.user_metadata.name
        const email = getSession.session.user.user_metadata.email
        if (userNameElement && userEmailElement) {
            userNameElement.innerText = name;
            userNameElement.style.textTransform = "capitalize"
            userEmailElement.innerText = email;


            ordersLi.style.display = 'block';

            signoutLink.style.display = 'flex';
            loginLink.style.display = 'none';
        }
    }
    else {

        ordersLi.style.display = 'none';

        signoutLink.style.display = 'none';
        loginLink.style.display = 'flex';
    }
}
checkSession()
document.getElementById("signout-link")?.addEventListener('click', signoutfunc)

export async function updateCartCount() {
    const { session: getSession } = await session();
    if (getSession) {

        const cartUserEmail = getSession.user.email;
        const allCart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cart = allCart.filter(item => item.email == cartUserEmail);
        const totalItems = cart.length;

        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            // Show the badge only if there are items in the cart
            cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
}
updateCartCount()
