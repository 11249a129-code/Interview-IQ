import Link from "next/link";

export default function TwoSumPage() {
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


      {/* Question */}
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">

        {/* Back */}
        <Link
          href="/practice/dsa"
          className="text-sm text-slate-400 transition hover:text-blue-400"
        >
          ← Back to DSA Questions
        </Link>


        {/* Header */}
        <section className="mt-8">

          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-md bg-green-500/10 px-3 py-1 text-sm text-green-400">
              Easy
            </span>

            <span className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-400">
              Arrays
            </span>

          </div>

          <h1 className="mt-5 text-4xl font-bold">
            Two Sum
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            Find two numbers in an array that add up to a
            given target.
          </p>

        </section>


        {/* Problem */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="text-2xl font-bold">
            Problem
          </h2>

          <p className="mt-5 leading-8 text-slate-300">
            Given an array of integers and a target value,
            return the indices of the two numbers such that
            they add up to the target.
          </p>

          <p className="mt-5 leading-8 text-slate-300">
            You may assume that each input has exactly one
            solution, and you cannot use the same element
            twice.
          </p>

        </section>


        {/* Example */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="text-2xl font-bold">
            Example
          </h2>

          <div className="mt-5 rounded-xl bg-slate-950 p-5 font-mono text-sm text-slate-300">

            <p>
              Input: nums = [2, 7, 11, 15], target = 9
            </p>

            <p className="mt-3">
              Output: [0, 1]
            </p>

            <p className="mt-3 text-slate-500">
              Explanation: nums[0] + nums[1] = 2 + 7 = 9
            </p>

          </div>

        </section>


        {/* Answer Area */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold">
              Your Solution
            </h2>

            <span className="text-sm text-slate-500">
              Python
            </span>

          </div>

          <textarea
            placeholder="Write your solution here..."
            className="mt-5 h-64 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <div className="mt-5 flex flex-wrap gap-3">

            <Link
  href="/practice/dsa/two-sum/result"
  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
>
  Submit Solution
</Link>
            <button className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-blue-500 hover:text-white">
              View Hint
            </button>

          </div>

        </section>


        {/* AI Hint */}
        <section className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

          <div className="flex gap-4">

            <div className="text-3xl">
              🤖
            </div>

            <div>

              <h3 className="font-bold text-blue-400">
                AI Interview Coach
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Need help? Use hints to understand the approach
                without immediately revealing the complete solution.
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}