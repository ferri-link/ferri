// KV key schema and TTL for the match store — shared by the write (click) and
// read (match) sides so both agree on where clicks live and how they expire.

// Probabilistic window: how long a click stays matchable by a shared anchor
// (IP / geo). Short to limit false matches on shared IPs. The deterministic
// clickId path lives much longer (CLICK_TTL_SECONDS).
export const MATCH_WINDOW_SECONDS = 15 * 60; // 15 minutes

// How long the click record itself is kept, for the deterministic clickId
// lookup. Longer than the probabilistic window because an exact token has no
// false-match risk and must outlive slow installs — e.g. the Android Play
// Install Referrer delivering the token hours after the click.
export const CLICK_TTL_SECONDS = 24 * 60 * 60; // 1 day

export const clickKey = (clickId: string) => `click:${clickId}`;
export const ipKey = (ipHash: string) => `ip:${ipHash}`;
export const geoKey = (country: string, region: string) =>
  `geo:${country}:${region}`;
