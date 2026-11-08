import Link from "next/link";

export default function ResumePage() {
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
              className="text-slate-300 hover:text-white"
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

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold">
            S
          </div>

        </div>
      </nav>


      {/* Main */}
      <div className="mx-auto max-w-5xl px-6 py-12">

        <Link
          href="/dashboard"
          className="text-sm text-slate-400 hover:text-blue-400"
        >
          ← Back to Dashboard
        </Link>

        <section className="mt-10 text-center">

          <div className="text-6xl">
            📄
          </div>

          <h1 className="mt-6 text-4xl font-bold">
            Resume Analyzer
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Upload your resume and get personalized feedback
            to improve your chances of getting shortlisted.
          </p>

        </section>


        {/* Upload Box */}
        <section className="mt-10 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">

          <div className="text-5xl">
            📤
          </div>

          <h2 className="mt-5 text-2xl font-bold">
            Upload Your Resume
          </h2>

          <p className="mt-3 text-slate-400">
            Upload your PDF resume to begin the analysis.
          </p>

          <label className="mt-7 inline-block cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">
            Choose Resume
            <input
              type="file"
              accept=".pdf"
              className="hidden"
            />
          </label>

          <p className="mt-4 text-sm text-slate-500">
            Supported format: PDF
          </p>

        </section>


        {/* What We Analyze */}
        <section className="mt-10">

          <h2 className="text-2xl font-bold">
            What We'll Analyze
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-3xl">🎯</div>
              <h3 className="mt-4 font-bold">
                ATS Compatibility
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Check how well your resume is optimized for
                applicant tracking systems.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-3xl">🛠️</div>
              <h3 className="mt-4 font-bold">
                Skills
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Identify important technical and soft skills
                in your resume.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-3xl">📝</div>
              <h3 className="mt-4 font-bold">
                Content Quality
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Get suggestions for improving your resume
                content and descriptions.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="text-3xl">📊</div>
              <h3 className="mt-4 font-bold">
                Overall Score
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Receive an overall resume score with
                actionable recommendations.
              </p>
            </div>

          </div>

        </section>


        {/* Coming Soon */}
        <section className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 text-center">

          <p className="text-blue-400">
            🤖 AI-powered analysis
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Resume analysis will become fully functional
            when we connect the backend and AI system.
          </p>

        </section>

      </div>

    </main>
  );
}