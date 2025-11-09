export const formatDateArray = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length !== 3) return '';
  const [year, month, day] = dateArray;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const formatTimeArray = (timeArray) => {
  if (!Array.isArray(timeArray) || timeArray.length !== 2) return '';
  const [hour, minute] = timeArray;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};