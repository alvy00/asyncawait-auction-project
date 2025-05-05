import supabase from "../../config/supabaseClient";


export const getUser = () => {
    const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");
    if(!token) return console.log('no user found');
    
    return supabase.auth.getUser(token);
}