export const commingSoon="/images/coming-soon-image.jpg"


export function formatReadableDate(isoDateString?: string): string {
  if (!isoDateString) return "--";

  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleDateString("en-GB", options);
}

