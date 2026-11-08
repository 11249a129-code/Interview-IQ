"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Question = {
  id: number;
  title: string;
  difficulty: string;
  topic: string;
  description: string;
};

export default function DSAPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      const { data, error } = await supabase
        .from("questions")
        .select("id, title, difficulty, topic, description")
        .eq("category", "DSA")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading DSA questions:", error);
        setLoading(false);
        return;
      }

      setQuestions(data || []);
      setLoading(false);
    }

    loadQuestions();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 px-6 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <Link href="/" className="text-2xl font-bold">
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
      <div className="mx-auto max-w-6xl px-6 py-14 md:px-8">

        <Link
          href="/practice"
          className="text-slate-400 transition hover:text-blue-400"
        >
          ← Back to Practice
        </Link>


        {/* Header */}
        <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 md:p-10">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="text-5xl">
                💻
              </div>

              <h1 className="mt-5 text-4xl font-bold">
                Data Structures & Algorithms
              </h1>

              <p className="mt-3 max-w-2xl text-lg text-slate-400">
                Practice coding problems and core data structures
                and algorithms for technical interviews.
              </p>

            </div>


            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-7 py-5 text-center">

              <p className="text-3xl font-bold text-blue-400">
                {loading ? "..." : questions.length}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Questions
              </p>

            </div>

          </div>

        </section>


        {/* Questions */}
        <section className="mt-10">

          <div className="mb-6">

            <h2 className="text-2xl font-bold">
              DSA Questions
            </h2>

            <p className="mt-2 text-slate-400">
              Choose a question to start practicing.
            </p>

          </div>


          {loading ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading questions...
            </div>

          ) : questions.length === 0 ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              No DSA questions found.
            </div>

          ) : (

            <div className="space-y-4">

              {questions.map((question, index) => (

                <Link
                  key={question.id}
                  href={`/practice/question/${question.id}`}
                  className="group block rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div className="flex items-start gap-5">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-slate-400">
                        {index + 1}
                      </div>

                      <div>

                        <h3 className="text-lg font-semibold transition group-hover:text-blue-400">
                          {question.title}
                        </h3>

                        {question.topic && (
                          <p className="mt-1 text-sm text-slate-500">
                            {question.topic}
                          </p>
                        )}

                      </div>

                    </div>


                    <span
                      className={`w-fit rounded-md px-3 py-1 text-xs font-medium ${
                        question.difficulty === "Easy"
                          ? "bg-green-500/10 text-green-400"
                          : question.difficulty === "Medium"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {question.difficulty}
                    </span>

                  </div>

                </Link>

              ))}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}