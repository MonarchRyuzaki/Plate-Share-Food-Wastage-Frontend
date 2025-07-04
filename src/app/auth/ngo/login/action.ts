"use server";

import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function loginNgo(formData: unknown) {
  const validatedFields = loginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return { error: "Invalid email or password." };
  }

  const { email, password } = validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "ngo",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Login failed." };
    }

    if (data.token && data.user) {
      const cookiesStore = await cookies();
      cookiesStore.set("plateshare-auth-token", data.token, {
        httpOnly: true,
        path: "/",
      });
      cookiesStore.set("plateshare-user-name", data.user.name, {
        httpOnly: true,
        path: "/",
      });
      cookiesStore.set("plateshare-user-role", data.user.role, {
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
