export const THEME_STORAGE_KEY = 'my-room:theme'

export type ThemeMode = 'day' | 'night'

/**
 * Runs before paint so the correct theme is on <html> by first render.
 * Kept as a string because it has to be inlined into <head> as a blocking
 * script — the alternative is a visible flash of the wrong theme.
 */
export function themeBootstrapScript(defaultMode: ThemeMode): string {
  return `(function(){try{var s=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY,
  )});var night=s?s==='night':${defaultMode === 'night'};var d=document.documentElement;d.classList.toggle('dark',night);d.dataset.theme=night?'night':'day';}catch(e){}})();`
}
