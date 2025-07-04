"use server";

import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function loginDonor(formData: unknown) {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password } = validatedFields.data;

  // Check if backend URL is configured
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log("Backend URL:", backendUrl);

  if (!backendUrl) {
    console.error("NEXT_PUBLIC_BACKEND_URL is not defined");
    return {
      error: "Backend configuration error. Please check environment variables.",
    };
  }

  try {
    const apiUrl = `${backendUrl}/api/auth/login`;
    console.log("Making login request to:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        role: "donor",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Login failed:", data);
      return { error: data.message || "Login failed." };
    }

    if (data.token && data.user) {
      const cookieStore = await cookies();
      cookieStore.set("plateshare-auth-token", data.token, {
        httpOnly: true,
        path: "/",
      });
      cookieStore.set("plateshare-user-name", data.user.name, {
        httpOnly: true,
        path: "/",
      });
      cookieStore.set("plateshare-user-role", data.user.role, {
        httpOnly: true,
        path: "/",
      });
      return { success: "Login successful! Redirecting..." };
    }

    return { error: "Login failed: Invalid server response." };
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: "An unexpected error occurred while processing your request.",
    };
  }
}
