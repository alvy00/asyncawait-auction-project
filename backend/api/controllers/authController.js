import supabase from "../../config/supabaseClient.js";

export const getUser = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null; // No token or invalid header
  }

  const token = authHeader.split(" ")[1];

  try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error) {
          console.error("Supabase auth error:", error.message);
          return null;
      }
      return data.user;
  } catch (error) {
      console.error("Error fetching user:", error.message);
      return null;
  }
};

