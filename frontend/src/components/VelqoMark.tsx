type VelqoMarkProps = {
  className?: string;
  compact?: boolean;
};

const VelqoMark = ({ className = "", compact = false }: VelqoMarkProps) => (
  <span className={`inline-flex overflow-hidden bg-black ${compact ? "size-9 rounded-xl p-1.5" : "rounded-2xl px-3 py-2"} ${className}`}>
    <img
      src={compact ? "/velqo-favicon.png" : "/velqo-logo.png"}
      alt="Velqo"
      className={compact ? "size-full object-contain" : "h-11 w-auto object-contain"}
    />
  </span>
);

export default VelqoMark;
