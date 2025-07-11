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
