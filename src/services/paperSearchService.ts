import { fetchOpenAlexWorks } from "../api/openAlex";
import type { Paper, PaperSearchParams } from "../types";
import { mapOpenAlexWorkToPaper } from "./paperMapper";

export async function searchPapers(
  params: PaperSearchParams,
  signal?: AbortSignal,
): Promise<Paper[]> {
  const response = await fetchOpenAlexWorks(params, signal);
  return response.results.map(mapOpenAlexWorkToPaper);
}
