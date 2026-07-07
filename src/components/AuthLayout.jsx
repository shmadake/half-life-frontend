function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex bg-ink font-body">
      {/* Brand panel */}
      <div className="hidden md:flex flex-col justify-between w-2/5 bg-ink border-r border-border p-10">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text tracking-tight">
            HalfLife
          </h1>
          <p className="text-muted text-sm mt-1">Log it before it fades.</p>
        </div>

        <DecayCurve />

        <p className="text-muted text-xs leading-relaxed max-w-xs">
          Every topic you learn starts at full strength. Without revision,
          retention decays — HalfLife tells you exactly when to step back in.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-semibold text-text mb-1">
            {title}
          </h2>
          <p className="text-muted text-sm mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function DecayCurve() {
  return (
    <svg
      viewBox="0 0 280 120"
      className="w-full max-w-xs motion-reduce:[&_path]:[stroke-dashoffset:0]"
    >
      <path
        d="M 10 20 Q 100 20 140 70 T 270 100"
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1"
      />
      <path
        d="M 10 20 Q 100 20 140 70 T 270 100"
        fill="none"
        stroke="var(--color-fresh)"
        strokeWidth="2"
        strokeLinecap="round"
        pathLength="1"
        style={{
          strokeDasharray: 1,
          strokeDashoffset: 1,
          animation: "draw 1.4s ease-out forwards",
        }}
      />
      <circle cx="10" cy="20" r="4" fill="var(--color-fresh)" />
      <circle cx="270" cy="100" r="4" fill="var(--color-fade)" />
      <style>{`
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}

export default AuthLayout;
