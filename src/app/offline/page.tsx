"use client";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAF7] px-6">
      <section className="w-full max-w-md rounded-3xl border border-[#E4E9E3] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#173F32] text-2xl text-white">
          ↗
        </div>

        <h1 className="mt-6 text-2xl font-bold text-[#173F32]">
          You're offline
        </h1>

        <p className="mt-3 leading-7 text-[#66736A]">
          Your money plan matters. Reconnect to the internet and try again
          to load any pages that aren't available offline.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 w-full rounded-xl bg-black px-5 py-3 font-semibold text-white transition-colors hover:bg-[#39745A]"
        >
          Try again
        </button>
      </section>
    </main>
  );
}