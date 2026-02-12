import MouseScroll from "@/components/MouseScroll";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen">
      <MouseScroll />

      {/* Footer / Contact Section */}
      <footer className="h-screen flex items-center justify-center text-white/50">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest">Designed by WSP</p>
          <p className="mt-2 text-xs opacity-50">&copy; 2026</p>
        </div>
      </footer>
    </main>
  );
}
