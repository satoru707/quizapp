export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Format as: "May 21, 2023 at 3:45 PM"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};
