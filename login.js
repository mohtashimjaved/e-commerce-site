const supabaseclient = supabase.createClient('https://whmlfysqskwnizilqjbr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobWxmeXNxc2t3bml6aWxxamJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTcyNjcsImV4cCI6MjA3NjE5MzI2N30.AF3Rk8iIBEjaa8Ci4XXZyLHM8_nS_NdXQ5iiOA0KYZ4')

const email = document.getElementById("email");
const password = document.getElementById("password");
const modifyText = document.getElementById("modify_text");
const loginBtn = document.getElementById("login_btn");

// Password strength indicator
password.addEventListener('input', function() {
    const strengthIndicator = this.parentElement.querySelector('.password-strength');
    const passwordValue = this.value;
    
    // Reset classes
    strengthIndicator.className = 'password-strength';
    
    if (passwordValue.length > 0) {
        let strength = 0;
        
        // Check password strength
        if (passwordValue.length >= 8) strength++;
        if (/[a-z]/.test(passwordValue)) strength++;
        if (/[A-Z]/.test(passwordValue)) strength++;
        if (/[0-9]/.test(passwordValue)) strength++;
        if (/[^A-Za-z0-9]/.test(passwordValue)) strength++;
        
        // Apply strength classes
        if (strength <= 2) {
            strengthIndicator.classList.add('weak');
        } else if (strength <= 4) {
            strengthIndicator.classList.add('medium');
        } else {
            strengthIndicator.classList.add('strong');
        }
    }
});

async function login() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = emailRegex.test(email.value);
    
    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    let value_check;
    
    if (!validEmail) {
        modifyText.classList.add('error', 'shake');
        modifyText.innerText = "Please Enter A Valid Email Address";
        setTimeout(() => { modifyText.classList.remove('shake'); }, 600);
        email.focus();
        value_check = false;
    }
    else if (password.value === "") {
        modifyText.classList.add('error', 'shake');
        modifyText.innerText = "Please Enter Your Password";
        setTimeout(() => { modifyText.classList.remove('shake'); }, 600);
        password.focus();
        value_check = false;
    }
    else {
        value_check = true;
    }
    
    if (value_check) {
        await signin(email.value, password.value);
    }
    
    // Remove loading state
    loginBtn.classList.remove('loading');
    loginBtn.disabled = false;
}

async function signin(email, password) {
    const { data, error } = await supabaseclient.auth.signInWithPassword({
        email: email,
        password: password
    });
    
    if (error) {
        console.error(error.message);
        modifyText.classList.add('error', 'shake');
        modifyText.innerText = error.message;
        setTimeout(() => { modifyText.classList.remove('shake'); }, 600);
        return error;
    }
    
    modifyText.classList.remove('error', 'shake');
    modifyText.classList.add('success');
    modifyText.innerText = "Login Successful! Redirecting...";
    
    setTimeout(() => { 
        window.location.href = "/";
    }, 1500);
    
    return data;
}

async function session() {
    const { data, error } = await supabaseclient.auth.getSession();
    if (error) {
        console.log(error);
    }
    console.log(data);
    if (data.session) {
        window.location.href = "/";
    }
    return data;
}

// Initialize session check
session();