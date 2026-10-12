import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import {
  schemes as seedSchemes,
  schemeCategories as seedCategories,
  indianStates as seedStates,
} from '../data/mockData'

const DataContext = createContext(null)

const KEY_SCHEMES    = 'sb_data_schemes_v1'
const KEY_CATEGORIES = 'sb_data_categories_v1'
const KEY_STATES     = 'sb_data_states_v1'

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : fallback
  } catch {
    return fallback
  }
}

function writeLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

const normalisedSeedSchemes = seedSchemes.map((s) => ({
  ...s,
  active: s.active !== false,
}))

export function DataProvider({ children }) {
  const [schemes, setSchemes] = useState(() => readLS(KEY_SCHEMES, normalisedSeedSchemes))
  const [categories, setCategories] = useState(() => readLS(KEY_CATEGORIES, seedCategories))
  const [states, setStates] = useState(() => readLS(KEY_STATES, seedStates))

  useEffect(() => { writeLS(KEY_SCHEMES, schemes) }, [schemes])
  useEffect(() => { writeLS(KEY_CATEGORIES, categories) }, [categories])
  useEffect(() => { writeLS(KEY_STATES, states) }, [states])

  // ---- Schemes ----
  const addScheme = useCallback((data) => {
    const scheme = {
      ...data,
      id: data.id || crypto.randomUUID(),
      active: data.active !== false,
    }
    setSchemes((prev) => [scheme, ...prev])
    return scheme
  }, [])

  const updateScheme = useCallback((id, patch) => {
    setSchemes((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }, [])

  const deleteScheme = useCallback((id) => {
    setSchemes((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const setSchemeActive = useCallback((id, active) => {
    setSchemes((prev) => prev.map((s) => (s.id === id ? { ...s, active } : s)))
  }, [])

  // ---- Categories ----
  const addCategory = useCallback((data) => {
    const cat = { ...data, id: data.id || crypto.randomUUID() }
    setCategories((prev) => [...prev, cat])
    return cat
  }, [])

  const updateCategory = useCallback((id, patch) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }, [])

  const deleteCategory = useCallback((id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // ---- States ----
  const addState = useCallback((name) => {
    const trimmed = String(name || '').trim()
    if (!trimmed) return
    setStates((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]))
  }, [])

  const deleteState = useCallback((name) => {
    setStates((prev) => prev.filter((s) => s !== name))
  }, [])

  // ---- Reset ----
  const resetToSeed = useCallback(() => {
    setSchemes(normalisedSeedSchemes)
    setCategories(seedCategories)
    setStates(seedStates)
  }, [])

  const activeSchemes = useMemo(() => schemes.filter((s) => s.active !== false), [schemes])

  const getSchemeById = useCallback((id) => schemes.find((s) => s.id === id), [schemes])

  const value = {
    schemes,
    activeSchemes,
    categories,
    states,
    addScheme,
    updateScheme,
    deleteScheme,
    setSchemeActive,
    addCategory,
    updateCategory,
    deleteCategory,
    addState,
    deleteState,
    resetToSeed,
    getSchemeById,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}