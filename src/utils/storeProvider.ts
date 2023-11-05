import { create } from "zustand";

const useLangStore = create((set) => ({
  lang: {},
  setLang: (lang: any) => set({ lang }),
}));

const useGameStore = create((set) => ({
  name: "",
  setName: (name: string) => set({ name }),
}));

export { useLangStore, useGameStore };
