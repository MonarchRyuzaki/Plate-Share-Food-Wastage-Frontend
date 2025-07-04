"use server";

import { z } from "zod";

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
});

export async function registerDonor(formData: unknown) {
  const validatedFields = registerSchema.safeParse(formData);

  if (!validatedFields.success) {
    // Creating a flattened error map
    const errorMap = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errorMap)[0]?.[0];

    return {
      error: firstError || "Invalid fields!",
    };
  }

  const { name, email, password, phone, address, city, state } =
    validatedFields.data;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          address,
          city,
          state,
          role: "donor",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Registration failed." };
    }

    return { success: "Registration successful! Please login." };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      error: "An unexpected error occurred while processing your request.",
    };
  }
}
