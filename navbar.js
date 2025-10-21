const supabaseclient = supabase.createClient('https://whmlfysqskwnizilqjbr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobWxmeXNxc2t3bml6aWxxamJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTcyNjcsImV4cCI6MjA3NjE5MzI2N30.AF3Rk8iIBEjaa8Ci4XXZyLHM8_nS_NdXQ5iiOA0KYZ4')

// document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const offCanvasMenu = document.getElementById('off-canvas-menu');
    const closeMenu = document.getElementById('close-main-menu');
    const overlay = document.getElementById('overlay');

    const userNameElement = document.getElementById('user-name');
    const userEmailElement = document.getElementById('user-email');
    const profileLi = document.getElementById('profile-li');
    const ordersLi = document.getElementById('orders-li');

    const loginLink = document.getElementById('login-link');
    const signoutLink = document.getElementById('signout-link');

    const searchToggle = document.getElementById('search-toggle');
    const searchBarSection = document.getElementById('search-bar-section');

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

    function toggleSearch() {
        searchBarSection.classList.toggle('active');
    }

    menuToggle.addEventListener('click', toggleNav);
    closeMenu.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);

    offCanvasMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));

    searchToggle.addEventListener('click', toggleSearch);
    document.getElementById('close-search').addEventListener('click', toggleSearch);

    async function session() {
        const { data, error } = await supabaseclient.auth.getSession()
        if (error) {
            console.log(error);
        }
        console.log(data);
        if (data.session) {
            const name = data.session.user.user_metadata.name
            const email = data.session.user.user_metadata.email
            userNameElement.textContent = name;
            userEmailElement.textContent = email;

            profileLi.style.display = 'block';
            ordersLi.style.display = 'block';

            signoutLink.style.display = 'flex';
            loginLink.style.display = 'none';
        }
        else  {
            profileLi.style.display = 'none';
            ordersLi.style.display = 'none';

            signoutLink.style.display = 'none';
            loginLink.style.display = 'flex';
        }
        return data;
    }
    session()
    async function signoutfunc() {
        const { error } = await supabaseclient.auth.signOut()
        if (error) {
            console.log(error);
        }
        window.location.reload();
    }
    // signoutLink.addEventListener("click", signoutfunc)
// });