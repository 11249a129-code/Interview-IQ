import Link from "next/link";

export default function MockInterviewPage() {
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
              className="text-slate-300 transition hover:text-white"
            >
              Practice
            </Link>

            <Link
              href="/mock-interview"
              className="text-blue-400"
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
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8">

        <Link
          href="/dashboard"
          className="text-sm text-slate-400 transition hover:text-blue-400"
        >
          ← Back to Dashboard
        </Link>


        {/* Hero */}
        <section className="mt-10 text-center">

          <div className="text-6xl">
            🤖
          </div>

          <p className="mt-6 text-blue-400">
            AI-powered interview practice
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-5xl">
            Mock Interview
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
            Practice realistic interview questions with an AI
            interviewer and receive personalized feedback.
          </p>

        </section>


        {/* Interview Types */}
        <section className="mt-12">

          <h2 className="text-2xl font-bold">
            Choose Your Interview
          </h2>

          <p className="mt-2 text-slate-400">
            Select an interview type to get started.
          </p>


          <div className="mt-6 grid gap-6 md:grid-cols-3">

            {/* Technical */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500">

              <div className="text-4xl">
                💻
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Technical
              </h3>

              <p className="mt-3 text-slate-400">
                Practice DSA, SQL, Python, OOP, operating systems
                and other technical interview questions.
              </p>

              <button className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500">
                Start Technical →
              </button>

            </div>


            {/* Behavioral */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500">

              <div className="text-4xl">
                🎤
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Behavioral
              </h3>

              <p className="mt-3 text-slate-400">
                Practice common HR and behavioral questions
                using realistic interview scenarios.
              </p>

              <button className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500">
                Start Behavioral →
              </button>

            </div>


            {/* Mixed */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 transition hover:-translate-y-1 hover:border-blue-500">

              <div className="text-4xl">
                🚀
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Mixed Interview
              </h3>

              <p className="mt-3 text-slate-400">
                Combine technical and behavioral questions for
                a complete interview experience.
              </p>

              <button className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500">
                Start Mixed →
              </button>

            </div>

          </div>

        </section>


        {/* How It Works */}
        <section className="mt-14">

          <h2 className="text-2xl font-bold">
            How It Works
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-3xl">1️⃣</div>
              <h3 className="mt-4 font-bold">
                Choose Interview
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Select the type of interview you want to practice.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-3xl">2️⃣</div>
              <h3 className="mt-4 font-bold">
                Answer Questions
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Answer questions just like you would in a real
                interview.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-3xl">3️⃣</div>
              <h3 className="mt-4 font-bold">
                Get Feedback
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Receive feedback on your answers and areas to
                improve.
              </p>
            </div>

          </div>

        </section>


        {/* Previous Performance */}
        <section className="mt-14 pb-12">

          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-8">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>

                <p className="text-blue-400">
                  Your Progress
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  You've completed 12 mock interviews 🎯
                </h2>

                <p className="mt-2 text-slate-400">
                  Keep practicing to improve your interview
                  confidence.
                </p>

              </div>

              <div className="text-left md:text-right">

                <p className="text-4xl font-bold text-blue-500">
                  78%
                </p>

                <p className="text-sm text-slate-500">
                  Average Score
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}