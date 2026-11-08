import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <h1 className="text-2xl font-bold">
          Interview<span className="text-blue-500">IQ</span>
        </h1>

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

        <Link
  href="/dashboard"
  className="rounded-lg bg-blue-600 px-6 py-3 text-white"
>
  Get Started
</Link>
      </nav>


      {/* Hero Section */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">

        <div className="mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm text-blue-400">
          🚀 AI-Powered Interview Preparation
        </div>

        <h2 className="max-w-4xl text-5xl font-bold leading-tight md:text-7xl">
          Ace Your Next
          <span className="text-blue-500"> Interview</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Practice interviews, improve your skills, analyze your resume,
          and get AI-powered feedback — all in one platform.
        </p>

        <div className="mt-10 flex gap-4">

          <button className="rounded-xl bg-blue-600 px-7 py-4 font-semibold hover:bg-blue-500">
            Start Mock Interview →
          </button>

          <button className="rounded-xl border border-slate-700 px-7 py-4 font-semibold hover:bg-slate-800">
            Explore Practice
          </button>

        </div>

      </section>


      {/* Features */}
      <section className="px-8 pb-20">

        <h3 className="mb-10 text-center text-3xl font-bold">
          Everything You Need to Prepare
        </h3>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
            <div className="text-4xl">🎤</div>
            <h4 className="mt-5 text-xl font-bold">
              AI Mock Interviews
            </h4>
            <p className="mt-3 text-slate-400">
              Practice realistic interviews with an AI interviewer
              and receive instant feedback.
            </p>
          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
            <div className="text-4xl">📄</div>
            <h4 className="mt-5 text-xl font-bold">
              Resume Analyzer
            </h4>
            <p className="mt-3 text-slate-400">
              Upload your resume and discover skills, weaknesses,
              and improvement opportunities.
            </p>
          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">
            <div className="text-4xl">📊</div>
            <h4 className="mt-5 text-xl font-bold">
              Performance Analytics
            </h4>
            <p className="mt-3 text-slate-400">
              Track your interview performance and understand
              exactly where you need to improve.
            </p>
          </div>

        </div>

      </section>

    </main>
  );
}