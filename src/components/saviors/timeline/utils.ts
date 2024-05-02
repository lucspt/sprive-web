export const getMonthName = (date: Date) => {
  return date.toLocaleString("default", { month: "short" })
};

export const getDateName = (date: Date) => {
  return date.toLocaleString("default", { month: "short", day: "2-digit" })
};
