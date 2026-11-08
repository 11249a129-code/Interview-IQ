
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      return NextResponse.json(
        {
          error:
            "User ID must be 3–20 characters and contain only letters, numbers, or underscores.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !secretKey) {
      throw new Error("Server authentication configuration is missing.");
    }

    const admin = createClient(supabaseUrl, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Internal email mapping. Students only use their username.
    const internalEmail =
      `${cleanUsername}@users.interviewiq.invalid`;

    const { data, error } = await admin.auth.admin.createUser({
      email: internalEmail,
      password,
      email_confirm: true,
      user_metadata: {
        username: cleanUsername,
      },
    });

    if (error) {
      if (
        error.message.toLowerCase().includes("already") ||
        error.message.toLowerCase().includes("duplicate")
      ) {
        return NextResponse.json(
          { error: "This User ID is already taken." },
          { status: 409 }
        );
      }

      console.error("Registration error:", error.message);

      return NextResponse.json(
        { error: "Unable to create your account." },
        { status: 400 }
      );
    }

    const { error: profileError } = await admin
      .from("profiles")
      .insert({
        user_id: data.user.id,
        username: cleanUsername,
      });

    if (profileError) {
      await admin.auth.admin.deleteUser(data.user.id);

      console.error("Profile creation error:", profileError.message);

      return NextResponse.json(
        { error: "Unable to finish account creation." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration API error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
