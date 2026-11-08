import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({
      success: false,
      message: "Supabase environment variables are missing",
      urlExists: !!url,
      keyExists: !!key,
    });
  }

  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from("questions")
    .select("id, title, category, difficulty")
    .limit(10);

  if (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
  }

  return NextResponse.json({
    success: true,
    count: data?.length || 0,
    questions: data,
  });
}