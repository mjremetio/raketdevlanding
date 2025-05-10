export function PatternBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="w-full h-full opacity-20 dark:opacity-10"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="tech-pattern"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path fill="#0A192F" d="M0 0h60v60H0z" opacity=".05" />
            <path
              stroke="#64FFDA"
              strokeWidth=".5"
              d="M20 30l20-20M60 30L30 60M0 30l30-30M30 60l20-20M10 30l20-20M50 30L30 10M0 0h60v60H0z"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tech-pattern)" />
      </svg>
    </div>
  );
}
