"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Question = {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  topic?: string;
};

export default function BookmarkedPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function getOrCreateUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      return session.user;
    }

    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      console.error("Anonymous sign-in failed:", error);
      return null;
    }

    return data.user;
  }

  async function loadBookmarks() {
    setLoading(true);

    const user = await getOrCreateUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Get bookmarked question IDs for this user
    const { data: progressData, error: progressError } =
      await supabase
        .from("user_progress")
        .select("question_id")
        .eq("user_id", user.id)
        .eq("bookmarked", true);

    if (progressError) {
      console.error(
        "Error loading bookmarks:",
        progressError
      );
      setLoading(false);
      return;
    }

    const questionIds =
      progressData?.map((item) => item.question_id) || [];

    // No bookmarks
    if (questionIds.length === 0) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    // Get the actual questions
    const { data: questionData, error: questionError } =
      await supabase
        .from("questions")
        .select("id, title, category, difficulty, topic")
        .in("id", questionIds)
        .order("id", { ascending: true });

    if (questionError) {
      console.error(
        "Error loading bookmarked questions:",
        questionError
      );
      setLoading(false);
      return;
    }

    setQuestions(questionData || []);
    setLoading(false);
  }

  useEffect(() => {
    loadBookmarks();
  }, []);

  async function removeBookmark(questionId: number) {
    setRemovingId(questionId);

    const user = await getOrCreateUser();

    if (!user) {
      setRemovingId(null);
      return;
    }

    const { error } = await supabase
      .from("user_progress")
      .update({
        bookmarked: false,
      })
      .eq("user_id", user.id)
      .eq("question_id", questionId);

    if (error) {
      console.error(
        "Error removing bookmark:",
        error
      );
      setRemovingId(null);
      return;
    }

    // Remove it immediately from the page
    setQuestions((current) =>
      current.filter((question) => question.id !== questionId)
    );

    setRemovingId(null);
  }

  function getIcon(category: string) {
    if (category === "DSA") return "💻";
    if (category === "SQL") return "🗄️";
    if (category === "Python") return "🐍";
    if (category === "OOP") return "⚙️";
    if (category === "OS") return "🖥️";
    if (category === "Networks") return "🌐";
    if (category === "AIML") return "🤖";
    if (category === "HR") return "💬";

    return "📚";
  }

  function getDifficultyStyle(difficulty: string) {
    if (difficulty === "Easy") {
      return "bg-green-500/10 text-green-400";
    }

    if (difficulty === "Medium") {
      return "bg-yellow-500/10 text-yellow-400";
    }

    return "bg-red-500/10 text-red-400";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 px-6 py-5 md:px-8">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-bold"
          >
            Interview<span className="text-blue-500">IQ</span>
          </Link>

          <div className="hidden gap-8 md:flex">

            <Link
              href="/dashboard"
              className="text-slate-300 transition hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="text-slate-300 transition hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/practice"
              className="text-blue-400"
            >
              Practice
            </Link>

            <Link
              href="/mock-interview"
              className="text-slate-300 transition hover:text-white"
            >
              Mock Interview
            </Link>

          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold">
            S
          </div>

        </div>

      </nav>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">

        {/* Header */}
        <section className="mb-10">

          <p className="mb-3 text-blue-400">
            Your saved questions
          </p>

          <h1 className="text-4xl font-bold md:text-5xl">
            Bookmarked Questions ⭐
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            Save important questions and come back to them
            whenever you want to practice again.
          </p>

        </section>

        {/* Back */}
        <div className="mb-8">

          <Link
            href="/practice"
            className="text-sm font-medium text-slate-400 transition hover:text-white"
          >
            ← Back to Practice
          </Link>

        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

            <p className="text-slate-400">
              Loading your bookmarks...
            </p>

          </div>
        )}

        {/* Empty */}
        {!loading && questions.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

            <div className="text-6xl">
              ⭐
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              No bookmarked questions yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-400">
              When you find a question you want to practice
              later, click the ⭐ Bookmark button.
            </p>

            <Link
              href="/practice"
              className="mt-7 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              Explore Questions →
            </Link>

          </div>
        )}

        {/* Questions */}
        {!loading && questions.length > 0 && (
          <section>

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  Saved for Later
                </h2>

                <p className="mt-1 text-slate-400">
                  {questions.length} bookmarked{" "}
                  {questions.length === 1
                    ? "question"
                    : "questions"}
                </p>

              </div>

            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {questions.map((question) => (

                <div
                  key={question.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500"
                >

                  {/* Top */}
                  <div className="flex items-start justify-between">

                    <span className="text-3xl">
                      {getIcon(question.category)}
                    </span>

                    <span
                      className={`rounded-md px-3 py-1 text-xs ${getDifficultyStyle(
                        question.difficulty
                      )}`}
                    >
                      {question.difficulty}
                    </span>

                  </div>

                  {/* Title */}
                  <h3 className="mt-5 text-xl font-bold">
                    {question.title}
                  </h3>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      {question.category}
                    </span>

                    {question.topic && (
                      <span className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-400">
                        {question.topic}
                      </span>
                    )}

                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between gap-3">

                    <Link
                      href={`/practice/question/${question.id}`}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500"
                    >
                      Solve →
                    </Link>

                    <button
                      onClick={() =>
                        removeBookmark(question.id)
                      }
                      disabled={
                        removingId === question.id
                      }
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-red-500 hover:text-red-400 disabled:opacity-50"
                    >
                      {removingId === question.id
                        ? "Removing..."
                        : "Remove ⭐"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>
        )}

      </div>

    </main>
  );
}