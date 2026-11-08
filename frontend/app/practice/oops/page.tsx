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

export default function OOPPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      const { data, error } = await supabase
        .from("questions")
        .select("id, title, difficulty, topic, description")
        .eq("category", "OOP")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading OOP questions:", error);
      } else {
        setQuestions(data || []);
      }

      setLoading(false);
    }

    loadQuestions();
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] text-white">

      {/* NAVBAR */}
      <nav className="border-b border-slate-800 px-8 py-5">
        <div className="flex items-center justify-between">

          <Link href="/" className="text-3xl font-bold">
            Interview<span className="text-blue-500">IQ</span>
          </Link>

          <div className="flex items-center gap-12 text-lg">
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="text-slate-300 hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/practice"
              className="text-blue-500"
            >
              Practice
            </Link>

            <Link
              href="/mock-interview"
              className="text-slate-300 hover:text-white"
            >
              Mock Interview
            </Link>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold">
            S
          </div>

        </div>
      </nav>

      {/* CONTENT */}
      <div className="mx-auto max-w-[1500px] px-8 py-16">

        {/* BACK */}
        <Link
          href="/practice"
          className="text-lg text-slate-400 hover:text-white"
        >
          ← Back to Practice
        </Link>

        {/* HERO */}
        <section className="mt-12 rounded-[32px] border border-slate-800 bg-[#111827] px-14 py-14">

          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-center">

            <div>

              <div className="mb-6 text-5xl">
                🧩
              </div>

              <h1 className="text-5xl font-bold">
                OOP
              </h1>

              <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-400">
                Practice object-oriented programming concepts and common
                OOP interview questions.
              </p>

            </div>

            {/* QUESTION COUNT */}
            <div className="flex h-36 w-36 flex-shrink-0 flex-col items-center justify-center rounded-3xl border border-slate-800 bg-[#020617]">
              <span className="text-4xl font-bold text-blue-400">
                {questions.length}
              </span>

              <span className="mt-2 text-slate-400">
                Questions
              </span>
            </div>

          </div>

        </section>

        {/* QUESTIONS */}
        <section className="mt-16">

          <h2 className="text-4xl font-bold">
            OOP Questions
          </h2>

          <p className="mt-3 text-lg text-slate-400">
            Choose a question to start practicing.
          </p>

          {loading ? (
            <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-10 text-center text-slate-400">
              Loading questions...
            </div>
          ) : questions.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-10 text-center text-slate-400">
              No OOP questions found.
            </div>
          ) : (
            <div className="mt-8 space-y-5">

              {questions.map((question, index) => (

                <Link
                  key={question.id}
                  href={`/practice/question/${question.id}`}
                  className="group flex flex-col gap-5 rounded-3xl border border-slate-800 bg-[#111827] p-7 transition hover:border-blue-500 md:flex-row md:items-center"
                >

                  {/* NUMBER */}
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-xl font-semibold text-slate-400">
                    {index + 1}
                  </div>

                  {/* QUESTION */}
                  <div className="flex-1">

                    <h3 className="text-2xl font-bold group-hover:text-blue-400">
                      {question.title}
                    </h3>

                    {question.topic && (
                      <p className="mt-2 text-lg text-slate-500">
                        {question.topic}
                      </p>
                    )}

                  </div>

                  {/* DIFFICULTY */}
                  <div>
                    <span
                      className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        question.difficulty?.toLowerCase() === "easy"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : question.difficulty?.toLowerCase() === "medium"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </div>

                  {/* ARROW */}
                  <div className="text-xl text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-400">
                    →
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