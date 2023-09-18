declare module 'tinyurl' {
    export function shorten(url: string, cb: (shortUrl: string | null, error?: Error) => void): void;
    export function shortenWithAlias(data: { url: string; alias: string }, cb: (shortUrl: string | null, error?: Error) => void): void;
    export function resolve(url: string, cb: (longUrl: string | null, error?: Error) => void): void;
  }
  