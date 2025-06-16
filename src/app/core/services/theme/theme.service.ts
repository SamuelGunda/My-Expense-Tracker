import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = signal<boolean>(this.initializeTheme());
  private initializeTheme(): boolean {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      this.applyTheme(isDark);
      return isDark;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyTheme(prefersDark);
      return prefersDark;
    }
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme(): void {
    const newValue = !this.darkMode();
    this.darkMode.set(newValue);
    this.applyTheme(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  isDarkMode(): boolean {
    return this.darkMode();
  }
}
