export function formatDuration(seconds: number, format: "pretty" | "colon" = "colon") {
  if (Number.isNaN(seconds) || seconds < 0) {
    return format === "colon" ? "00:00" : "0s";
  }

  const safeSeconds = Math.floor(seconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  const padTwoDigits = (value: number) => String(value).padStart(2, "0");

  if (format === "colon") {
    return [
      hours > 0 ? padTwoDigits(hours) : null,
      padTwoDigits(minutes),
      padTwoDigits(remainingSeconds),
    ]
      .filter((part): part is string => part !== null)
      .join(":");
  }

  return [hours ? `${hours}h` : "", minutes ? `${minutes}m` : "", `${remainingSeconds}s`]
    .filter(Boolean)
    .join(" ");
}
