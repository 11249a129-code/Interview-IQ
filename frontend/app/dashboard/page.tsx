
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Question = {
  id: number;
  category: string;
  difficulty: string;
};

type Progress = {
  question_id: number;
  completed: boolean;
  bookmarked: boolean;
  score: number | null;
  completed_at: string | null;
};

export default function Dashboard() {
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  // Get the currently logged-in user.
  async function getLoggedInUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Authentication error:", error);
      return null;
    }

    return user;
  }

  // Load dashboard data.
  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setLoading(true);

      const user = await getLoggedInUser();

      if (!isMounted) return;

      // Redirect to login if no authenticated user exists.
      if (!user) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      // Get all questions.
      const { data: questionData, error: questionError } =
        await supabase
          .from("questions")
          .select("id, category, difficulty");

      if (!isMounted) return;

      if (questionError) {
        console.error("Error loading questions:", questionError);
      } else {
        setQuestions(questionData || []);
      }

      // Get progress belonging to this logged-in user.
      const { data: progressData, error: progressError } =
        await supabase
          .from("user_progress")
          .select(
            "question_id, completed, bookmarked, score, completed_at"
          )
          .eq("user_id", user.id);

      if (!isMounted) return;

      if (progressError) {
        console.error("Error loading progress:", progressError);
      } else {
        setProgress(progressData || []);
      }

      setLoading(false);
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // -----------------------------
  // REAL DASHBOARD STATISTICS
  // -----------------------------

  const totalQuestions = questions.length;

  const completedQuestions = progress.filter(
    (item) => item.completed
  ).length;

  const bookmarkedQuestions = progress.filter(
    (item) => item.bookmarked
  ).length;

  const overallProgress =
    totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

  // Calculate average score from completed questions.
  const scoredQuestions = progress.filter(
    (item) =>
      item.completed &&
      item.score !== null &&
      item.score !== undefined
  );

  const averageScore =
    scoredQuestions.length > 0
      ? Math.round(
          scoredQuestions.reduce(
            (sum, item) => sum + Number(item.score || 0),
            0
          ) / scoredQuestions.length
        )
      : 0;

  // -----------------------------
  // CURRENT STREAK
  // -----------------------------

  function calculateStreak() {
    const dateSet = new Set(
      progress
        .filter((item) => item.completed && item.completed_at)
        .map((item) => {
          const date = new Date(item.completed_at!);

          return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0"),
          ].join("-");
        })
    );

    const uniqueDates = Array.from(dateSet).sort().reverse();

    if (uniqueDates.length === 0) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const latestDate = new Date(`${uniqueDates[0]}T00:00:00`);

    // A streak remains active if the last activity was today
    // or yesterday.
    const daysSinceActivity = Math.round(
      (today.getTime() - latestDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (daysSinceActivity > 1 || daysSinceActivity < 0) {
      return 0;
    }

    let streak = 1;

    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = new Date(`${uniqueDates[i]}T00:00:00`);
      const previous = new Date(`${uniqueDates[i + 1]}T00:00:00`);

      const difference = Math.round(
        (current.getTime() - previous.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (difference === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  const currentStreak = calculateStreak();

  // -----------------------------
  // SKILL PROGRESS
  // -----------------------------

  function getCategoryProgress(category: string) {
    const categoryQuestions = questions.filter(
      (question) => question.category === category
    );

    if (categoryQuestions.length === 0) {
      return 0;
    }

    const categoryIds = new Set(
      categoryQuestions.map((question) => question.id)
    );

    const completed = progress.filter(
      (item) =>
        item.completed && categoryIds.has(item.question_id)
    ).length;

    return Math.round(
      (completed / categoryQuestions.length) * 100
    );
  }

  const dsaProgress = getCategoryProgress("DSA");
  const sqlProgress = getCategoryProgress("SQL");
  const pythonProgress = getCategoryProgress("Python");
  const oopProgress = getCategoryProgress("OOP");
  const hrProgress = getCategoryProgress("HR");

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <Link href="/" className="text-2xl font-bold">
            Interview<span className="text-blue-500">IQ</span>
          </Link>

          <div className="hidden gap-10 md:flex">
            <Link
              href="/dashboard"
              className="text-blue-400 transition hover:text-blue-300"
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
              className="text-slate-300 transition hover:text-white"
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

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-8">

        {/* Welcome Section */}
        <section className="mb-10">
          <p className="mb-3 text-lg text-blue-400">
            Your preparation dashboard
          </p>

          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Welcome back, Sujitha 👋
          </h2>

          <p className="mt-4 text-lg text-slate-400">
            Track your real progress and keep moving toward your
            dream job.
          </p>
        </section>

        {/* Statistics */}
        <section className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:border-blue-500">
            <p className="text-lg text-slate-400">
              Overall Progress
            </p>

            <h3 className="mt-3 text-5xl font-bold text-blue-500">
              {loading ? "—" : `${overallProgress}%`}
            </h3>

            <p className="mt-3 text-slate-500">
              {completedQuestions} of {totalQuestions} questions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:border-blue-500">
            <p className="text-lg text-slate-400">
              Average Score
            </p>

            <h3 className="mt-3 text-5xl font-bold">
              {loading ? "—" : averageScore}
            </h3>

            <p className="mt-3 text-slate-500">
              Based on completed questions
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:border-blue-500">
            <p className="text-lg text-slate-400">
              Questions Solved
            </p>

            <h3 className="mt-3 text-5xl font-bold">
              {loading ? "—" : completedQuestions}
            </h3>

            <p className="mt-3 text-slate-500">
              Across all topics
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:border-orange-500">
            <p className="text-lg text-slate-400">
              Current Streak
            </p>

            <h3 className="mt-3 text-5xl font-bold">
              🔥 {loading ? "—" : currentStreak}
            </h3>

            <p className="mt-3 text-orange-400">
              {currentStreak > 0
                ? "Keep the streak going!"
                : "Start practicing today!"}
            </p>
          </div>

        </section>

        {/* Continue Preparing */}
        <section className="mb-14">
          <h2 className="mb-6 text-3xl font-bold">
            Continue Preparing
          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500">
              <div className="mb-5 text-4xl">🎯</div>

              <h3 className="text-2xl font-bold">
                Practice Questions
              </h3>

              <p className="mt-3 min-h-[60px] text-slate-400">
                Practice technical, behavioral and interview
                questions.
              </p>

              <Link
                href="/practice"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                Start Practice →
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500">
              <div className="mb-5 text-4xl">🤖</div>

              <h3 className="text-2xl font-bold">
                Mock Interview
              </h3>

              <p className="mt-3 min-h-[60px] text-slate-400">
                Take an AI-powered mock interview and receive
                detailed feedback.
              </p>

              <Link
                href="/mock-interview"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                Start Interview →
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500">
              <div className="mb-5 text-4xl">📄</div>

              <h3 className="text-2xl font-bold">
                Resume Analyzer
              </h3>

              <p className="mt-3 min-h-[60px] text-slate-400">
                Upload your resume and get AI-powered
                improvement suggestions.
              </p>

              <Link
                href="/resume"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                Analyze Resume →
              </Link>
            </div>

          </div>
        </section>

        {/* Your Skills */}
        <section className="mb-14">
          <h2 className="mb-6 text-3xl font-bold">
            Your Skills 📊
          </h2>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

            {[
              { name: "DSA", value: dsaProgress },
              { name: "SQL & DBMS", value: sqlProgress },
              { name: "Python", value: pythonProgress },
              { name: "OOP", value: oopProgress },
              { name: "Communication / HR", value: hrProgress },
            ].map((skill) => (
              <div key={skill.name} className="mb-7 last:mb-0">
                <div className="mb-2 flex justify-between">
                  <span className="font-medium">
                    {skill.name}
                  </span>

                  <span className="text-slate-400">
                    {loading ? "—" : `${skill.value}%`}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-800">
                  <div
                    className="h-3 rounded-full bg-blue-500 transition-all"
                    style={{
                      width: loading ? "0%" : `${skill.value}%`,
                    }}
                  />
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Bookmarked Questions */}
        <section className="mb-14">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>
                <p className="text-blue-400">
                  Your saved questions
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  Bookmarked Questions ⭐
                </h2>

                <p className="mt-2 text-slate-400">
                  {loading ? "Loading..." : `${bookmarkedQuestions} question${bookmarkedQuestions === 1 ? "" : "s"} saved for later practice.`}
                </p>
              </div>

              <Link
                href="/practice/bookmarked"
                className="rounded-lg border border-slate-700 px-6 py-3 font-semibold transition hover:border-blue-500"
              >
                View Bookmarks →
              </Link>

            </div>
          </div>
        </section>

        {/* Recommendations */}
        <section className="mb-14">
          <div className="mb-6">
            <p className="text-blue-400">
              Based on your progress
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Recommended for You 💡
            </h2>

            <p className="mt-2 text-slate-400">
              Focus on areas where you have completed fewer
              questions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500">
              <div className="mb-4 text-3xl">💻</div>

              <h3 className="text-xl font-bold">
                Strengthen DSA
              </h3>

              <p className="mt-3 text-slate-400">
                {dsaProgress === 0
                  ? "You haven't completed any DSA questions yet. Start with arrays and strings."
                  : `You have completed ${dsaProgress}% of the DSA question bank. Keep practicing to improve.`}
              </p>

              <Link
                href="/practice/dsa"
                className="mt-5 inline-block text-blue-400 transition hover:text-blue-300"
              >
                Practice DSA →
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500">
              <div className="mb-4 text-3xl">🗄️</div>

              <h3 className="text-xl font-bold">
                Build SQL Skills
              </h3>

              <p className="mt-3 text-slate-400">
                {sqlProgress === 0
                  ? "Start practicing SQL queries, joins and database concepts."
                  : `You have completed ${sqlProgress}% of the SQL question bank.`}
              </p>

              <Link
                href="/practice/sql"
                className="mt-5 inline-block text-blue-400 transition hover:text-blue-300"
              >
                Practice SQL →
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-blue-500">
              <div className="mb-4 text-3xl">🤖</div>

              <h3 className="text-xl font-bold">
                Take a Mock Interview
              </h3>

              <p className="mt-3 text-slate-400">
                Test your knowledge in a realistic interview
                environment and improve your confidence.
              </p>

              <Link
                href="/mock-interview"
                className="mt-5 inline-block text-blue-400 transition hover:text-blue-300"
              >
                Start Mock Interview →
              </Link>
            </div>

          </div>
        </section>

        {/* Quick Practice */}
        <section className="pb-12">
          <h2 className="mb-6 text-3xl font-bold">
            Quick Practice ⚡
          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl border border-blue-500 bg-blue-600 p-7">
              <div className="text-3xl">🎙️</div>

              <h3 className="mt-4 text-2xl font-bold">
                Mock Interview
              </h3>

              <p className="mt-2 text-blue-100">
                Practice with an AI interviewer.
              </p>

              <Link
                href="/mock-interview"
                className="mt-5 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-blue-600 transition hover:bg-slate-100"
              >
                Start Now →
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
              <div className="text-3xl">💻</div>

              <h3 className="mt-4 text-2xl font-bold">
                Coding Practice
              </h3>

              <p className="mt-2 text-slate-400">
                Solve coding problems and improve your DSA.
              </p>

              <Link
                href="/practice"
                className="mt-5 inline-block rounded-lg border border-slate-700 px-5 py-3 font-semibold transition hover:border-blue-500"
              >
                Practice Now →
              </Link>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
