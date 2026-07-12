import type { CatalogRepository } from "@/types/catalog";
import { isDemoMode } from "./mode";

let repositoryPromise: Promise<CatalogRepository> | null = null;

export function getCatalogRepository(): Promise<CatalogRepository> {
  if (!repositoryPromise) {
    repositoryPromise = isDemoMode()
      ? import("./demo-repository").then((module) => module.demoRepository)
      : import("./supabase-repository").then(
          (module) => new module.SupabaseCatalogRepository(),
        );
  }
  return repositoryPromise;
}
