import MouseScroll from "@/components/MouseScroll";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen">
      <MouseScroll />

      {/* Footer Section */}
      <footer className="relative h-screen flex items-center justify-center border-t border-white/5">
        <div className="text-center space-y-8 px-4">
          <div className="space-y-2">
            <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-white/90">
              Ready to elevate your game?
            </h3>
            <p className="text-white/50 text-sm md:text-base tracking-wide">
              Join the waitlist for exclusive early access
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors w-full sm:w-80"
            />
            <button className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-all duration-300 w-full sm:w-auto">
              Notify Me
            </button>
          </div>

          <div className="pt-12 space-y-2">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Designed by WSP
            </p>
            <p className="text-xs text-white/30">
              &copy; 2026 WSP Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
