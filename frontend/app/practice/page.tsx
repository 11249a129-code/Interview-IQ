"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Question = {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  topic: string;
};

const categories = [
  {
    name: "DSA",
    dbCategory: "DSA",
    icon: "💻",
    description: "Algorithms, data structures & problem solving",
    link: "/practice/dsa",
  },
  {
    name: "SQL & DBMS",
    dbCategory: "SQL",
    icon: "🗄️",
    description: "Queries, databases & DBMS concepts",
    link: "/practice/sql",
  },
  {
    name: "Python",
    dbCategory: "Python",
    icon: "🐍",
    description: "Python programming & problem solving",
    link: "/practice/python",
  },
  {
    name: "OOP",
    dbCategory: "OOP",
    icon: "⚙️",
    description: "Object-oriented programming concepts",
    link: "/practice/oops",
  },
  {
    name: "Operating Systems",
    dbCategory: "OS",
    icon: "🖥️",
    description: "Processes, memory & system concepts",
    link: "/practice/os",
  },
  {
    name: "Computer Networks",
    dbCategory: "Networks",
    icon: "🌐",
    description: "Networking, protocols & communication",
    link: "/practice/networks",
  },
  {
    name: "AI/ML",
    dbCategory: "AI/ML",
    icon: "🤖",
    description: "Machine learning & artificial intelligence",
    link: "/practice/aiml",
  },
  {
    name: "HR & Behavioral",
    dbCategory: "HR",
    icon: "💬",
    description: "Behavioral & common interview questions",
    link: "/practice/hr",
  },
];

export default function PracticePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      const { data, error } = await supabase
        .from("questions")
        .select("id, title, category, difficulty, topic")
        .order("id", { ascending: true });

      if (error) {
        console.error("Error loading questions:", error);
        setLoading(false);
        return;
      }

      setQuestions(data || []);
      setLoading(false);
    }

    loadQuestions();
  }, []);

  const totalQuestions = questions.length;

  const easyCount = questions.filter(
    (q) => q.difficulty === "Easy"
  ).length;

  const mediumCount = questions.filter(
    (q) => q.difficulty === "Medium"
  ).length;

  const hardCount = questions.filter(
    (q) => q.difficulty === "Hard"
  ).length;

  /*
   * Show only a small selection on the Practice homepage.
   * The complete question bank remains inside Supabase
   * and will be shown on individual topic pages.
   */
  const recommendedQuestions = questions.slice(0, 6);

  const getIcon = (category: string) => {
    switch (category) {
      case "DSA":
        return "💻";
      case "SQL":
        return "🗄️";
      case "Python":
        return "🐍";
      case "OOP":
        return "⚙️";
      case "OS":
        return "🖥️";
      case "Networks":
        return "🌐";
      case "AI/ML":
        return "🤖";
      case "HR":
        return "💬";
      default:
        return "📚";
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          NAVBAR
      ===================================================== */}

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


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-14 md:px-8">


        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 px-8 py-12 md:px-12">

          <div className="relative z-10 max-w-3xl">

            <div className="mb-5 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
              Practice smarter • Interview better
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Master Your{" "}
              <span className="text-blue-500">
                Interview Skills
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
              Practice technical and behavioral interview questions
              across the topics that matter most. Learn, solve, and
              build confidence one question at a time.
            </p>

          </div>

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="absolute -bottom-24 right-20 h-56 w-56 rounded-full bg-purple-600/10 blur-3xl" />

        </section>


        {/* =====================================================
            STATS
        ===================================================== */}

        <section className="mt-6 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-500">
              Question Bank
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading ? "..." : totalQuestions}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Curated interview questions
            </p>

          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-500">
              Practice Topics
            </p>

            <p className="mt-2 text-3xl font-bold">
              {categories.length}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Technical & behavioral areas
            </p>

          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-500">
              Difficulty Levels
            </p>

            <p className="mt-2 text-3xl font-bold">
              3
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Easy • Medium • Hard
            </p>

          </div>

        </section>


        {/* =====================================================
            PRACTICE BY TOPIC
        ===================================================== */}

        <section className="mt-16">

          <div className="mb-8">

            <p className="text-sm font-medium text-blue-400">
              Choose your path
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Practice by Topic
            </h2>

            <p className="mt-2 text-slate-400">
              Select a topic and start practicing focused interview
              questions.
            </p>

          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map((category) => {

              const count = questions.filter(
                (question) =>
                  question.category === category.dbCategory
              ).length;

              return (
                <Link
                  key={category.name}
                  href={category.link}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-blue-500"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-2xl">
                      {category.icon}
                    </div>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                      {loading ? "..." : `${count} Q`}
                    </span>

                  </div>


                  <h3 className="mt-6 text-xl font-bold">
                    {category.name}
                  </h3>

                  <p className="mt-2 min-h-[40px] text-sm leading-5 text-slate-500">
                    {category.description}
                  </p>

                  <p className="mt-5 text-sm font-medium text-blue-400 transition group-hover:text-blue-300">
                    Start practicing →
                  </p>

                </Link>
              );
            })}

          </div>

        </section>


        {/* =====================================================
            RECOMMENDED QUESTIONS
        ===================================================== */}

        <section className="mt-16">

          <div className="mb-7">

            <p className="text-sm font-medium text-blue-400">
              Keep learning
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Recommended Questions 💡
            </h2>

            <p className="mt-2 text-slate-400">
              Start with a few questions from your interview
              preparation journey.
            </p>

          </div>


          {loading ? (

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
              Loading questions...
            </div>

          ) : (

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

              {recommendedQuestions.map((question) => (

                <Link
                  key={question.id}
                  href={`/practice/question/${question.id}`}
                  className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-blue-500"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-xl">
                      {getIcon(question.category)}
                    </div>

                    <span
                      className={`rounded-md px-3 py-1 text-xs font-medium ${
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


                  <h3 className="mt-5 text-lg font-bold transition group-hover:text-blue-400">
                    {question.title}
                  </h3>


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


                  <div className="mt-6 text-sm font-semibold text-blue-400">
                    Solve Question →
                  </div>

                </Link>

              ))}

            </div>

          )}

        </section>


        {/* =====================================================
            PROGRESS / STREAK
        ===================================================== */}

        <section className="mt-16 pb-10">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 md:p-10">

            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

              <div>

                <p className="text-sm font-medium text-blue-400">
                  Your Progress
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Keep your streak alive! 🔥
                </h2>

                <p className="mt-2 max-w-xl text-slate-400">
                  Practice consistently to improve your interview
                  skills and build your preparation streak.
                </p>

              </div>


              <div className="grid grid-cols-3 gap-8">

                <div className="text-center">

                  <p className="text-3xl font-bold text-orange-400">
                    0
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Day Streak
                  </p>

                </div>


                <div className="text-center">

                  <p className="text-3xl font-bold text-blue-400">
                    0
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Solved
                  </p>

                </div>


                <div className="text-center">

                  <p className="text-3xl font-bold text-purple-400">
                    0
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Points
                  </p>

                </div>

              </div>

            </div>


            <div className="mt-8">

              <div className="flex justify-between text-sm">

                <span className="text-slate-500">
                  Practice progress
                </span>

                <span className="text-slate-400">
                  0%
                </span>

              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-800">

                <div className="h-2 w-0 rounded-full bg-blue-500" />

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}