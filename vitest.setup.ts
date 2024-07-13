import { beforeAll, beforeEach, vi } from "vitest";
export * from "@testing-library/react";

import * as mockRouter from "next-router-mock";
import { cleanup } from "@testing-library/react";

const useRouter = mockRouter.useRouter;

beforeAll(() => {
  vi.mock("next/navigation", () => ({
    ...mockRouter,
    useSearchParams: () => {
      const router = useRouter();
      const path = router.query;
      return new URLSearchParams(path as never);
    },
  }));
});

beforeEach(() => {
  cleanup();
});
