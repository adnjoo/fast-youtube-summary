/**
 * Converts an ISO date string to a human-readable format.
 * 
 * This function takes an ISO date string and returns a string in the format of 'Month Day, Year, Time' 
 * where 'Month' is the full month name, 'Day' is the day of the month, 'Year' is the full year, 
 * and 'Time' is the time in 12-hour format with AM/PM.
 * 
 * @param {string} isoDate - The ISO date string to be converted.
 * @returns {string} - The human-readable date string.
 */
export function formatISOToHumanReadable(isoDate: string): string {
  const date = new Date(isoDate);

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: true,
  });
}
