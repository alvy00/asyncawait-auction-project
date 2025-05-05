import supabase from "../../config/supabaseClient";

export const getUser = async () => {
  const token = localStorage.getItem("sessionToken") || sessionStorage.getItem("sessionToken");

  if (!token) {
    console.log("No session token found.");
    return null;
  }

  // Set the session manually if needed (not always required if supabase handles it automatically)
  const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: token, // if you store refresh_token too
  });

  if (sessionError) {
    console.error("Error setting session:", sessionError.message);
    return null;
  }

  // Get the authenticated user
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }

  return data.user;
};
