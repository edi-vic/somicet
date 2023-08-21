
export const parseDate = (date) => {
  const dateObj = new Date(date)
  const parseDate = dateObj.toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  return parseDate;
}
