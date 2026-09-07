const LoadingIcon = () => {
  return (
    <svg
      className="animate-spin size-4 text-muted-foreground"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        className="opacity-25"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5 0 0 5 0 12h4z"
        className="opacity-75"
      />
    </svg>
  );
};

export default LoadingIcon;
