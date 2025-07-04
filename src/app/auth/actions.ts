"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("plateshare-auth-token");
  cookieStore.delete("plateshare-user-name");
  cookieStore.delete("plateshare-user-role");
  redirect("/");
}

export async function createFoodDonation(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("plateshare-auth-token");

  if (!token) {
    throw new Error("Authentication required");
  }

  // Log the backend URL for debugging
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    throw new Error(
      "Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL in your environment variables."
    );
  }

  try {
    const apiUrl = `${backendUrl}/api/food-donations`;
    console.log("Making request to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create donation");
    }

    const result = await response.json();
    return { success: true, donationId: result.donationId };
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error;
  }
}
