export const supabaseclient = supabase.createClient('https://whmlfysqskwnizilqjbr.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndobWxmeXNxc2t3bml6aWxxamJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTcyNjcsImV4cCI6MjA3NjE5MzI2N30.AF3Rk8iIBEjaa8Ci4XXZyLHM8_nS_NdXQ5iiOA0KYZ4')

export async function session() {
    const { data, error } = await supabaseclient.auth.getSession()
    if (error) {
        console.log(error);
    }
    console.log(data);
    return data;
}

