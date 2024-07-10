import { create } from "zustand";
import { devtools } from "zustand/middleware";

type LoadingStore = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const useLoadingStore = create<LoadingStore>()(
  devtools((set) => ({
    isLoading: false,
    setIsLoading: (isLoading) => set((state) => ({ isLoading })),
  }))
);

export default useLoadingStore;
