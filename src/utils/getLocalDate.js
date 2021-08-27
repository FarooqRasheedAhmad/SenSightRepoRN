import { timeConvert } from "./convertDate";

export const getLocalDate = () => {
  const d = new Date();
  const n = d.getTimezoneOffset() / 60;
  const timeOffset = n < 0 ? Math.abs(n) : -n;
  const { hours, minutes, sign } = timeConvert(timeOffset);
  const p = d.toISOString().replace("Z", "");
  const nDate = `${p}${sign === "+" ? "-" : "+"}${hours}:${minutes}`;
  const t = new Date(nDate);

  return { timeOffset, dateString: t.toISOString() };
};
