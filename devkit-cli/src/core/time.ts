export interface TimeData {
  unixSeconds: number;
  unixMilliseconds: number;
  iso8601: string;
  utcString: string;
  localString: string;
  timezone: string;
}

export function parseTime(input?: string | number): TimeData {
  let date: Date;

  if (input === undefined || input === '') {
    date = new Date();
  } else if (typeof input === 'number' || /^\d+$/.test(String(input))) {
    const num = Number(input);
    // If < 1e11 it's seconds, otherwise milliseconds
    date = num < 1e11 ? new Date(num * 1000) : new Date(num);
  } else {
    date = new Date(input);
  }

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date/time input: "${input}". Expected valid ISO string, Unix timestamp, or natural date.`);
  }

  return {
    unixSeconds: Math.floor(date.getTime() / 1000),
    unixMilliseconds: date.getTime(),
    iso8601: date.toISOString(),
    utcString: date.toUTCString(),
    localString: date.toString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}
