const supabaseclient = supabase.createClient('https://whmlfysqskwnizilqjbr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobWxmeXNxc2t3bml6aWxxamJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTcyNjcsImV4cCI6MjA3NjE5MzI2N30.AF3Rk8iIBEjaa8Ci4XXZyLHM8_nS_NdXQ5iiOA0KYZ4')
const password = document.getElementById("password");
const email = document.getElementById("email");
const modifyText = document.getElementById("modify_text");

function login() {
    loginfunc(email.value, password.value);

}

async function loginfunc(email, password) {
    const { data, error } = await supabaseclient.auth.signInWithPassword({
        email: email,
        password: password,
    })
    if (error) {
        console.log(error);
        modifyText.classList.add('error', 'shake'); 
        modifyText.innerText = error.message;
        setTimeout(() => {
            modifyText.classList.remove('shake');
        }, 600);
        return error;
    }
    console.log(data);

    modifyText.classList.remove('error', 'shake');
    modifyText.classList.add('success');
    modifyText.innerText = 'Login successful! Redirecting...';
    setTimeout(
        () => { window.location.href = "/" }, 2200
    )

    return data;
}
async function session() {
    const { data, error } = await supabaseclient.auth.getSession()
    if (error) {
        console.log(error);
    }
    console.log(data);
    if (data.session) {
        window.location.href = "/"
    };
    return data;
}
session()