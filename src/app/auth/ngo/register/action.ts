"use server";

export async function registerNgo(formData: FormData) {
  // The backend expects the role to be specified
  formData.append("role", "ngo");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
      {
        method: "POST",
        body: formData, // Sending as multipart/form-data
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Registration failed." };
    }

    return { success: "Registration successful! You can now log in." };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "An unexpected error occurred while processing your request.",
    };
  }
}
