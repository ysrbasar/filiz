import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LocationState {
  city: string | null
  setCity: (city: string) => void
  clearCity: () => void
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: null,
      setCity: (city) => set({ city }),
      clearCity: () => set({ city: null }),
    }),
    { name: 'filiz-location' }
  )
)
