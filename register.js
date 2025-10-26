const supabaseclient = supabase.createClient('https://whmlfysqskwnizilqjbr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobWxmeXNxc2t3bml6aWxxamJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTcyNjcsImV4cCI6MjA3NjE5MzI2N30.AF3Rk8iIBEjaa8Ci4XXZyLHM8_nS_NdXQ5iiOA0KYZ4')

const username_r = document.getElementById("username");
const email_r = document.getElementById("email_r");
const password_r = document.getElementById("password_r");
const modifyText = document.getElementById("modify_text");
const registerBtn = document.getElementById("register_btn");

// Password strength indicator
password_r.addEventListener('input', function() {
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

async function register() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const validPass = passwordRegex.test(password_r.value);
    const validemail = emailRegex.test(email_r.value);
    
    // Show loading state
    registerBtn.classList.add('loading');
    registerBtn.disabled = true;
    
    let value_check;
    
    if (username_r.value === "") {
        modifyText.classList.add('error', 'shake');
        modifyText.innerText = "Please Enter A Valid Username";
        setTimeout(() => { modifyText.classList.remove('shake'); }, 600);
        username_r.focus();
        value_check = false;
    }
    else if (!validemail) {
        modifyText.classList.add('error', 'shake');
        modifyText.innerText = "Please Enter A Valid Email Address";
        setTimeout(() => { modifyText.classList.remove('shake'); }, 600);
        email_r.focus();
        value_check = false;
    }
    else if (!validPass) {
        modifyText.classList.add('error', 'shake');
        modifyText.innerText = "Password must contain at least 8 characters, including uppercase, lowercase, number and special character";
        setTimeout(() => { modifyText.classList.remove('shake'); }, 600);
        password_r.focus();
        value_check = false;
    }
    else {
        value_check = true;
    }
    
    if (value_check) {
        await signup(username_r.value, email_r.value, password_r.value);
    }
    
    // Remove loading state
    registerBtn.classList.remove('loading');
    registerBtn.disabled = false;
}

function emptyInputValues(name, email, password) {
    for (let i = 0; i < arguments.length; i++) {
        arguments[i].value = "";
    }
}

async function signup(username, email, password) {
    const { data, error } = await supabaseclient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: username
            }
        }
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
    modifyText.innerText = "User Registered Successfully! Redirecting to login...";
    
    emptyInputValues(username_r, email_r, password_r);
    
    setTimeout(() => { 
        window.location.href = "/login.html"; 
    }, 2200);
    
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