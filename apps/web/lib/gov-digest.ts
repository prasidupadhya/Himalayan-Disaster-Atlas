'use client';
import { useEffect, useState } from 'react';

/** The daily copy of public government pages written by pipelines/gov_feeds (format atlas-gov-digest@1). */
export type Link = { text: string; href: string; document: boolean };
export type Table = { caption: string | null; header: string[]; rows: string[][] };
export type Page = { title: string | null; headings: string[]; tables: Table[]; links: Link[]; paragraphs: string[]; dates_mentioned: string[] };
export type River = { id: string; name: string | null; basin: string | null; status: string; water_level_m: number | null; warning_level_m: number | null; danger_level_m: number | null; observed_at: string | null; current?: boolean };
export type Rain = { id: string; name: string | null; basin: string | null; status: string; rain_1h_mm: number | null; rain_24h_mm: number | null; observed_at: string | null; current?: boolean };
/** Copies made before freshness filtering lack the optional fields; current counts then stay UNKNOWN. */
export type RiverContent = { station_count: number; status_counts: Record<string, number>; alert_stations: River[];
  fresh_hours?: number; current_station_count?: number; current_status_counts?: Record<string, number>; stale_alert_stations?: River[] };
export type RainContent = { station_count: number; status_counts: Record<string, number>; wettest_24h: Rain[];
  fresh_hours?: number; current_station_count?: number; current_status_counts?: Record<string, number>; implausible_24h?: number };
export type Scalar = string | number | boolean | null;
/** record_count counts every record in the window; records is capped. complete is false when the API page may have cut the window short. */
export type ListContent = { record_count: number; columns: string[]; records: Array<Record<string, Scalar>>; complete?: boolean; within_days?: number };
export type Entry = {
  id: string; agency: string; title: string; category: string; kind: 'html' | 'bipad-river' | 'bipad-rain' | 'json-list'; url: string;
  status: 'fetched' | 'unreachable' | 'blocked-by-robots' | 'error'; http_status: number | null; checked_at: string; fetched_at?: string | null;
  last_known?: boolean; error?: string; content?: Page | RiverContent | RainContent | ListContent; changes?: { new_links?: Link[]; new_records?: Array<Record<string, Scalar>>; status_changes?: Array<{ id: string; name: string | null; from: string | null; to: string }> };
};
export type Digest = { format: 'atlas-gov-digest@1'; generated_at: string; generated_at_nepal: string; notice: string; sources: Entry[];
  summary: { sources_fetched: number; sources_last_known: number; sources_unavailable: number; rivers_above_danger: number | null; rivers_above_warning: number | null; rain_stations_above_warning: number | null; rivers_current?: number | null; rain_current?: number | null; new_links: number; new_records?: number } };
export type DigestState = { status: 'loading' } | { status: 'missing' } | { status: 'error'; message: string } | { status: 'ready'; digest: Digest };

export const DIGEST_PATH = '/gov/latest.json';

/** Loads today's copy without the HTTP cache; a 404 means the first daily run has not happened yet. */
export function useGovDigest(): [DigestState, () => void] {
  const [state, setState] = useState<DigestState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(DIGEST_PATH, { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (response.status === 404) return setState({ status: 'missing' });
        if (!response.ok) throw new Error(`The digest answered HTTP ${response.status}.`);
        const digest = await response.json() as Digest;
        if (digest?.format !== 'atlas-gov-digest@1' || !Array.isArray(digest.sources)) throw new Error('The digest has an unexpected format.');
        setState({ status: 'ready', digest });
      })
      .catch(error => { if (!controller.signal.aborted) setState({ status: 'error', message: error instanceof Error ? error.message : 'The digest could not be read.' }); });
    return () => controller.abort();
  }, [attempt]);
  return [state, () => { setState({ status: 'loading' }); setAttempt(n => n + 1); }];
}

/** A timestamp in Nepal time, or null when it is missing or unreadable. */
export function nepalTime(value: string | null | undefined, locale = 'en-GB') {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : `${date.toLocaleString(locale, { timeZone: 'Asia/Kathmandu', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} NPT`;
}

export const findEntry = (digest: Digest, id: string) => digest.sources.find(e => e.id === id);
