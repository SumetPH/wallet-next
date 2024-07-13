import { beforeAll, vi } from "vitest";

import * as mockRouter from "next-router-mock";

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
