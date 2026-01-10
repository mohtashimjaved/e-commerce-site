export const supabaseclient = supabase.createClient('https://whmlfysqskwnizilqjbr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobWxmeXNxc2t3bml6aWxxamJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTcyNjcsImV4cCI6MjA3NjE5MzI2N30.AF3Rk8iIBEjaa8Ci4XXZyLHM8_nS_NdXQ5iiOA0KYZ4')

export async function session() {
  const { data, error } = await supabaseclient.auth.getSession()
  if (error) {
    console.log(error);
  }
  console.log(data);
  const useremail = data.session?.user?.email
  localStorage.setItem("currentUser", useremail)
  return data;
}

export async function signInWithGoogle() {
  const { data, error } = await supabaseclient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://dealio-site.netlify.app',
    },
  });
  if (error) {
    console.error('Error signing in with Google:', error.message);
  }
  else {
    // Handle successful sign-in (e.g., redirect to dashboard)
    console.log('Signed in with Google:', data);
  }
}
export async function signoutfunc() {
  const { error } = await supabaseclient.auth.signOut()
  // console.log(event.target);
  if (error) {
    console.log(error);
  }

  window.location.reload();
}

export async function deletefunc(id) {
  const { data, error } = await supabaseclient
    .from('orders')
    .delete()
    .eq('id', id)
    .select()
    if (error) {
      console.error(error.message)
      return error;
    }
    console.log(data)
  
    return data;
}