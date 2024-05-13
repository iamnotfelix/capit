export const formatDateTimeAgo = (inputDate: Date): string => {
  const currentDate = new Date();
  const millisecondsDiff = currentDate.getTime() - inputDate.getTime();
  const secondsDiff = millisecondsDiff / 1000;
  const minutesDiff = secondsDiff / 60;
  const hoursDiff = minutesDiff / 60;
  const daysDiff = hoursDiff / 24;
  const weeksDiff = daysDiff / 7;
  const monthsDiff =
    currentDate.getMonth() -
    inputDate.getMonth() +
    12 * (currentDate.getFullYear() - inputDate.getFullYear());
  const yearsDiff = currentDate.getFullYear() - inputDate.getFullYear();

  if (millisecondsDiff < 0) {
    return "Invalid date";
  } else if (millisecondsDiff < 60000) {
    return "Just now";
  } else if (minutesDiff < 60) {
    const minutes = Math.floor(minutesDiff);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (hoursDiff < 24) {
    const hours = Math.floor(hoursDiff);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (daysDiff < 7) {
    const days = Math.floor(daysDiff);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (weeksDiff < 4) {
    const weeks = Math.floor(weeksDiff);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (monthsDiff < 12) {
    return `${monthsDiff} month${monthsDiff > 1 ? "s" : ""} ago`;
  } else {
    return `${yearsDiff} year${yearsDiff > 1 ? "s" : ""} ago`;
  }
};

export const capitalizeAndDot = (text: string) => {
  return text[0].toUpperCase() + text.slice(1).toLowerCase() + ".";
};
