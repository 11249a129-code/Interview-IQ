import Link from "next/link";

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto max-w-4xl px-6 py-16">

        <Link
          href="/practice/dsa/two-sum"
          className="text-slate-400 hover:text-blue-400"
        >
          ← Back to Question
        </Link>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

          <div className="text-6xl">
            🎉
          </div>

          <h1 className="mt-6 text-4xl font-bold">
            Solution Submitted!
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            Great job! Your solution has been submitted successfully.
          </p>

          <div className="mx-auto mt-8 grid max-w-xl gap-4 sm:grid-cols-3">

            <div className="rounded-xl bg-slate-950 p-5">
              <p className="text-3xl font-bold text-green-400">
                100%
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Score
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-5">
              <p className="text-3xl font-bold text-blue-400">
                Easy
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Difficulty
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-5">
              <p className="text-3xl font-bold text-orange-400">
                🔥 6
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Day Streak
              </p>
            </div>

          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-4">

            <Link
              href="/practice/dsa"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500"
            >
              Next Question →
            </Link>

            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-700 px-6 py-3 font-semibold hover:border-blue-500"
            >
              View Dashboard
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}