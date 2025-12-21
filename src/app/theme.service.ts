import { computed, Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'boda-ro-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly theme = signal<Theme>(this.detectInitialTheme());

  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    this.applyTheme(this.theme());
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.applyTheme(theme);
    this.storeTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle('dark-theme', theme === 'dark');
  }

  private storeTheme(theme: Theme): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors.
    }
  }

  private detectInitialTheme(): Theme {
    const stored = this.readStoredTheme();
    if (stored) {
      return stored;
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  }

  private readStoredTheme(): Theme | null {
    try {
      if (typeof window === 'undefined') {
        return null;
      }

      const rawValue = window.localStorage.getItem(STORAGE_KEY);
      if (rawValue === 'light' || rawValue === 'dark') {
        return rawValue;
      }
    } catch {
      // Ignore storage errors.
    }

    return null;
  }
}
