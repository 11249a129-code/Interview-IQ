import Link from "next/link";

export default function PythonOOPPage() {
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
              className="text-blue-400"
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
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-8">

        <Link
          href="/practice/python"
          className="text-sm text-slate-400 hover:text-blue-400"
        >
          ← Back to Python
        </Link>


        {/* Header */}
        <section className="mt-8">

          <div className="flex flex-wrap gap-3">

            <span className="rounded-md bg-yellow-500/10 px-3 py-1 text-sm text-yellow-400">
              Medium
            </span>

            <span className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-400">
              Python
            </span>

          </div>

          <h1 className="mt-5 text-4xl font-bold">
            Python OOP Concepts
          </h1>

          <p className="mt-4 text-lg text-slate-400">
            Test your understanding of object-oriented
            programming concepts in Python.
          </p>

        </section>


        {/* Question */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="text-2xl font-bold">
            Interview Question
          </h2>

          <p className="mt-5 leading-8 text-slate-300">
            Explain the four major principles of Object-Oriented
            Programming: Encapsulation, Abstraction, Inheritance,
            and Polymorphism.
          </p>

        </section>


        {/* Example */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="text-2xl font-bold">
            Python Example
          </h2>

          <div className="mt-5 rounded-xl bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-300">
            <p>class Animal:</p>

            <p className="ml-5">
              def speak(self):
            </p>

            <p className="ml-10">
              print("Animal speaks")
            </p>

            <p className="mt-3">
              class Dog(Animal):
            </p>

            <p className="ml-5">
              def speak(self):
            </p>

            <p className="ml-10">
              print("Dog barks")
            </p>
          </div>

        </section>


        {/* Answer */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-8">

          <h2 className="text-2xl font-bold">
            Your Answer
          </h2>

          <textarea
            placeholder="Explain the OOP concepts in your own words..."
            className="mt-5 h-56 w-full resize-none rounded-xl border border-slate-800 bg-slate-950 p-5 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
          />

          <div className="mt-5 flex gap-3">

            <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">
              Submit Answer
            </button>

            <button className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-300 hover:border-blue-500">
              View Hint
            </button>

          </div>

        </section>


        {/* AI Coach */}
        <section className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

          <div className="flex gap-4">

            <div className="text-3xl">
              🤖
            </div>

            <div>

              <h3 className="font-bold text-blue-400">
                AI Interview Coach
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Explain your answer naturally. Later, our AI
                coach will evaluate your response and provide
                personalized feedback.
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}