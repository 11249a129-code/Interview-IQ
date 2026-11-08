"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Question = {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  topic?: string;
  description?: string;
  answer?: string;
  explanation?: string;
  points?: number;
};

type Progress = {
  completed: boolean;
  bookmarked: boolean;
  score: number | null;
  completed_at: string | null;
};

export default function QuestionPage() {
  const params = useParams();
  const questionId = Number(params.id);

  const [question, setQuestion] = useState<Question | null>(null);
  const [progress, setProgress] = useState<Progress>({
    completed: false,
    bookmarked: false,
    score: null,
    completed_at: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const [previousId, setPreviousId] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number | null>(null);

  const [code, setCode] = useState(
    "# Write your solution here\n\n"
  );

  const [language, setLanguage] = useState("Python");

  const [output, setOutput] = useState(
    "Run your code to see the result here."
  );

  const [isRunning, setIsRunning] = useState(false);

  // --------------------------------------------------
  // GET / CREATE ANONYMOUS USER
  // --------------------------------------------------

  async function getOrCreateUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting logged-in user:", error);
    return null;
  }

  if (!user) {
    console.log("No user is logged in.");
    return null;
  }

  return user;
}

  // --------------------------------------------------
  // LOAD QUESTION
  // --------------------------------------------------

  async function loadQuestion() {
    setLoading(true);

    if (!questionId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("questions")
      .select(
        "id, title, category, difficulty, topic, description, answer, explanation, points"
      )
      .eq("id", questionId)
      .single();

    if (error) {
      console.error("Error loading question:", error);
      setLoading(false);
      return;
    }

    setQuestion(data);

    // ----------------------------------------------
    // GET USER
    // ----------------------------------------------

    const user = await getOrCreateUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // ----------------------------------------------
    // LOAD PROGRESS
    // ----------------------------------------------

    const { data: progressData, error: progressError } =
      await supabase
        .from("user_progress")
        .select(
          "completed, bookmarked, score, completed_at"
        )
        .eq("user_id", user.id)
        .eq("question_id", questionId)
        .maybeSingle();

    if (progressError) {
      console.error(
        "Error loading progress:",
        progressError
      );
    }

    if (progressData) {
      setProgress({
        completed: progressData.completed ?? false,
        bookmarked: progressData.bookmarked ?? false,
        score: progressData.score ?? null,
        completed_at:
          progressData.completed_at ?? null,
      });
    }

    // ----------------------------------------------
    // LOAD PREVIOUS / NEXT QUESTIONS
    // ----------------------------------------------

    const { data: categoryQuestions, error: categoryError } =
      await supabase
        .from("questions")
        .select("id")
        .eq("category", data.category)
        .order("id", { ascending: true });

    if (!categoryError && categoryQuestions) {
      const currentIndex = categoryQuestions.findIndex(
        (item) => item.id === questionId
      );

      if (currentIndex > 0) {
        setPreviousId(
          categoryQuestions[currentIndex - 1].id
        );
      } else {
        setPreviousId(null);
      }

      if (
        currentIndex >= 0 &&
        currentIndex < categoryQuestions.length - 1
      ) {
        setNextId(
          categoryQuestions[currentIndex + 1].id
        );
      } else {
        setNextId(null);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    loadQuestion();
  }, [questionId]);

  // --------------------------------------------------
  // SAVE PROGRESS
  // --------------------------------------------------

  async function saveProgress(
    updates: Partial<Progress>
  ) {
    setSaving(true);

    const user = await getOrCreateUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const updatedProgress = {
      ...progress,
      ...updates,
    };

    setProgress(updatedProgress);

    // Check whether a row already exists
    const { data: existingRow, error: existingError } =
      await supabase
        .from("user_progress")
        .select("id")
        .eq("user_id", user.id)
        .eq("question_id", questionId)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Error checking progress:",
        existingError
      );
      setSaving(false);
      return;
    }

    const databaseData = {
      user_id: user.id,
      question_id: questionId,
      completed: updatedProgress.completed,
      bookmarked: updatedProgress.bookmarked,
      score: updatedProgress.score,
      completed_at: updatedProgress.completed
        ? updatedProgress.completed_at ||
          new Date().toISOString()
        : null,
    };

    if (existingRow) {
      const { error } = await supabase
        .from("user_progress")
        .update(databaseData)
        .eq("id", existingRow.id);

      if (error) {
        console.error(
          "Error updating progress:",
          error
        );
      }
    } else {
      const { error } = await supabase
        .from("user_progress")
        .insert(databaseData);

      if (error) {
        console.error(
          "Error inserting progress:",
          error
        );
      }
    }

    setSaving(false);
  }

  // --------------------------------------------------
  // BOOKMARK
  // --------------------------------------------------

  async function toggleBookmark() {
    await saveProgress({
      bookmarked: !progress.bookmarked,
    });
  }

  // --------------------------------------------------
  // COMPLETE
  // --------------------------------------------------

  async function toggleCompleted() {
    if (!progress.completed) {
      await saveProgress({
        completed: true,
        completed_at: new Date().toISOString(),
      });
    } else {
      await saveProgress({
        completed: false,
        completed_at: null,
      });
    }
  }

  // --------------------------------------------------
  // RUN CODE
  // --------------------------------------------------

 async function runCode() {
  if (language !== "Python") {
    setOutput("Python execution is currently supported.");
    return;
  }

  if (!code.trim()) {
    setOutput("Please write some Python code first.");
    return;
  }

  setIsRunning(true);
  setOutput("Starting Python...");

  try {
    // Load Pyodide directly from the CDN
    if (!(window as any).loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");

        script.src =
          "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js";

        script.onload = () => resolve();
        script.onerror = () =>
          reject(
            new Error("Could not load Python runtime.")
          );

        document.body.appendChild(script);
      });
    }

    const loadPyodide = (window as any).loadPyodide;

    const pyodide = await loadPyodide({
      indexURL:
        "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/",
    });

    let capturedOutput = "";

    pyodide.setStdout({
      batched: (text: string) => {
        capturedOutput += text;
      },
    });

    pyodide.setStderr({
      batched: (text: string) => {
        capturedOutput += text;
      },
    });

    const result = await pyodide.runPythonAsync(code);

    const resultText =
      result !== undefined && result !== null
        ? String(result)
        : "";

    const finalOutput =
      capturedOutput.trim() || resultText.trim();

    setOutput(
      finalOutput ||
        "Code executed successfully with no output."
    );
  } catch (error) {
    console.error("Python execution error:", error);

    setOutput(
      `Error:\n${
        error instanceof Error
          ? error.message
          : String(error)
      }`
    );
  } finally {
    setIsRunning(false);
  }
}


  // --------------------------------------------------
  // RESET CODE
  // --------------------------------------------------

  function resetCode() {
    if (isSQL) {
      setCode(
        "-- Write your SQL query here\n\n"
      );
    } else {
      setCode(
        "# Write your solution here\n\n"
      );
    }

    setOutput("Code editor reset.");
  }

  // --------------------------------------------------
  // QUESTION TYPE
  // --------------------------------------------------

  const category = question?.category || "";

  const isCoding =
    category === "DSA" ||
    category === "Python";

  const isSQL =
    category === "SQL";

  const isTheory =
    !isCoding &&
    !isSQL;

  // --------------------------------------------------
  // CATEGORY ICON
  // --------------------------------------------------

  function getCategoryIcon(categoryName: string) {
    if (categoryName === "DSA") return "💻";
    if (categoryName === "SQL") return "🗄️";
    if (categoryName === "Python") return "🐍";
    if (categoryName === "OOP") return "⚙️";
    if (categoryName === "OS") return "🖥️";
    if (categoryName === "Networks") return "🌐";
    if (categoryName === "AIML") return "🤖";
    if (categoryName === "HR") return "💬";

    return "📚";
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <nav className="border-b border-slate-800 px-6 py-5">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold"
            >
              Interview
              <span className="text-blue-500">
                IQ
              </span>
            </Link>
          </div>
        </nav>

        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="text-4xl">
              ⏳
            </div>

            <p className="mt-4 text-slate-400">
              Loading question...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // QUESTION NOT FOUND
  // --------------------------------------------------

  if (!question) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <nav className="border-b border-slate-800 px-6 py-5">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Link
              href="/"
              className="text-2xl font-bold"
            >
              Interview
              <span className="text-blue-500">
                IQ
              </span>
            </Link>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="text-6xl">
            😕
          </div>

          <h1 className="mt-6 text-3xl font-bold">
            Question not found
          </h1>

          <p className="mt-3 text-slate-400">
            We couldn't find this question in
            the InterviewIQ question bank.
          </p>

          <Link
            href="/practice"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
          >
            Back to Practice
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ================================================== */}
      {/* NAVBAR */}
      {/* ================================================== */}

      <nav className="border-b border-slate-800 px-6 py-5 md:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <Link
            href="/"
            className="text-2xl font-bold"
          >
            Interview
            <span className="text-blue-500">
              IQ
            </span>
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

      {/* ================================================== */}
      {/* MAIN */}
      {/* ================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-8">

        {/* Breadcrumb */}

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">

          <Link
            href="/practice"
            className="transition hover:text-blue-400"
          >
            Practice
          </Link>

          <span>›</span>

          <span>
            {question.category}
          </span>

          {question.topic && (
            <>
              <span>›</span>

              <span>
                {question.topic}
              </span>
            </>
          )}

        </div>

        {/* ================================================== */}
        {/* QUESTION HEADER */}
        {/* ================================================== */}

        <section className="mb-8">

          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

            <div>

              <div className="flex items-center gap-3">

                <span className="text-3xl">
                  {getCategoryIcon(
                    question.category
                  )}
                </span>

                <span
                  className={`rounded-md px-3 py-1 text-xs font-semibold ${
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

              <h1 className="mt-4 text-3xl font-bold md:text-4xl">
                {question.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">

                <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-slate-400">
                  {question.category}
                </span>

                {question.topic && (
                  <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-slate-400">
                    {question.topic}
                  </span>
                )}

                {question.points && (
                  <span className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm text-slate-400">
                    {question.points} points
                  </span>
                )}

              </div>

            </div>

            {/* Bookmark */}

            <button
              onClick={toggleBookmark}
              disabled={saving}
              className={`rounded-xl border px-5 py-3 font-medium transition ${
                progress.bookmarked
                  ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-yellow-500/50 hover:text-yellow-400"
              }`}
            >
              {progress.bookmarked
                ? "⭐ Bookmarked"
                : "☆ Bookmark"}
            </button>

          </div>

        </section>

        {/* ================================================== */}
        {/* CODING / SQL WORKSPACE */}
        {/* ================================================== */}

        {(isCoding || isSQL) && (

          <section className="grid gap-6 lg:grid-cols-2">

            {/* LEFT - PROBLEM */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900">

              <div className="border-b border-slate-800 px-6 py-4">

                <h2 className="font-semibold">
                  Problem
                </h2>

              </div>

              <div className="max-h-[650px] overflow-y-auto p-6">

                <div className="whitespace-pre-wrap leading-7 text-slate-300">
                  {question.description ||
                    "No problem description available."}
                </div>

                {/* Answer */}

                <div className="mt-8">

                  <button
                    onClick={() =>
                      setShowAnswer(!showAnswer)
                    }
                    className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                  >
                    {showAnswer
                      ? "Hide Answer"
                      : "Show Answer"}
                  </button>

                  {showAnswer && (
                    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-5">

                      <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-slate-300">
                        {question.answer ||
                          "Answer not available."}
                      </pre>

                    </div>
                  )}

                </div>

                {/* Explanation */}

                <div className="mt-5">

                  <button
                    onClick={() =>
                      setShowExplanation(
                        !showExplanation
                      )
                    }
                    className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                  >
                    {showExplanation
                      ? "Hide Explanation"
                      : "Show Explanation"}
                  </button>

                  {showExplanation && (
                    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm leading-7 text-slate-400">
                      {question.explanation ||
                        "Explanation not available."}
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* RIGHT - CODE EDITOR */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900">

              {/* Editor Header */}

              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">

                <div>

                  <h2 className="font-semibold">
                    {isSQL
                      ? "SQL Workspace"
                      : "Coding Workspace"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Write and test your solution
                  </p>

                </div>

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
                >
                  <option>Python</option>

                  {isSQL && (
                    <option>SQL</option>
                  )}
                </select>

              </div>

              {/* Code Editor */}

              <div className="p-4">

                <textarea
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value)
                  }
                  spellCheck={false}
                  className="h-[430px] w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-700 focus:border-blue-500"
                  placeholder={
                    isSQL
                      ? "-- Write your SQL query here"
                      : "# Write your Python solution here"
                  }
                />

              </div>

              {/* Editor Buttons */}

              <div className="flex flex-wrap gap-3 px-5 pb-5">

                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isRunning
                    ? "Running..."
                    : "▶ Run Code"}
                </button>

                <button
                  onClick={resetCode}
                  className="rounded-lg border border-slate-700 px-5 py-2.5 text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  ↻ Reset
                </button>

              </div>

{/* Output */}

<div className="border-t border-slate-800">

  <div className="px-5 py-4">
    <h3 className="text-sm font-semibold">
      Output
    </h3>
  </div>

  <div className="mx-5 mb-5 min-h-[110px] rounded-xl bg-slate-950 p-4">
    <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-400">
      {output}
    </pre>
  </div>

</div>

</div>

</section>
)}

{/* ================================================== */}
{/* THEORY WORKSPACE */}
{/* ================================================== */}

{isTheory && (

<section className="grid gap-6 lg:grid-cols-3">

  {/* Question */}

  <div className="lg:col-span-2">

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

      <h2 className="text-xl font-bold">
        Question
      </h2>

      <div className="mt-6 whitespace-pre-wrap leading-8 text-slate-300">
        {question.description ||
          "No question description available."}
      </div>

    </div>

  </div>

  {/* Actions */}

  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

    <p className="text-sm text-blue-400">
      InterviewIQ
    </p>

    <h2 className="mt-2 text-xl font-bold">
      Practice this question
    </h2>

    <p className="mt-3 text-sm leading-6 text-slate-400">
      Try answering the question yourself before
      checking the model answer.
    </p>

    <button
      onClick={() => setShowAnswer(!showAnswer)}
      className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
    >
      {showAnswer ? "Hide Answer" : "Show Answer"}
    </button>

    {showAnswer && (
      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5">
        <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
          {question.answer || "Answer not available."}
        </pre>
      </div>
    )}

    <button
      onClick={() =>
        setShowExplanation(!showExplanation)
      }
      className="mt-3 w-full rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:border-blue-500 hover:text-white"
    >
      {showExplanation
        ? "Hide Explanation"
        : "Show Explanation"}
    </button>

    {showExplanation && (
      <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm leading-6 text-slate-400">
        {question.explanation ||
          "Explanation not available."}
      </div>
    )}

  </div>

</section>

)}

{/* ================================================== */}
{/* COMPLETE BUTTON */}
{/* ================================================== */}

<section className="mt-8">

  <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">

    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div>

        <p className="font-semibold">
          {progress.completed
            ? "Question completed 🎉"
            : "Finished solving?"}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Mark this question as completed to update
          your progress.
        </p>

      </div>

      <button
        onClick={toggleCompleted}
        disabled={saving}
        className={`rounded-xl px-6 py-3 font-semibold transition ${
          progress.completed
            ? "border border-green-500/30 bg-green-500/10 text-green-400"
            : "bg-green-600 text-white hover:bg-green-500"
        }`}
      >
        {progress.completed
          ? "✓ Completed"
          : "✓ Mark as Completed"}
      </button>

    </div>

  </div>

</section>

{/* ================================================== */}
{/* PREVIOUS / NEXT */}
{/* ================================================== */}

<section className="mt-8 pb-12">

  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

    {previousId ? (
      <Link
        href={`/practice/question/${previousId}`}
        className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-4 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-white"
      >
        ← Previous Question
      </Link>
    ) : (
      <div />
    )}

    <Link
      href="/practice"
      className="text-center text-sm text-slate-500 transition hover:text-blue-400"
    >
      Back to Practice
    </Link>

    {nextId ? (
      <Link
        href={`/practice/question/${nextId}`}
        className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-4 text-sm font-medium text-slate-300 transition hover:border-blue-500 hover:text-white"
      >
        Next Question →
      </Link>
    ) : (
      <div />
    )}

  </div>

</section>

</div>

</main>
);
}