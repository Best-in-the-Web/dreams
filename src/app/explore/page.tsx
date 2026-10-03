import { Suspense } from "react";
import { ExploreClient } from "@/components/ExploreClient";

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[80vh] items-center justify-center text-moss">Loading explore…</div>
      }
    >
      <ExploreClient />
    </Suspense>
  );
}
