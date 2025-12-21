import { Component, Input, inject } from '@angular/core';

import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
})
export class ThemeToggleComponent {
  @Input() floating = false;

  private readonly themeService = inject(ThemeService);

  readonly isDark = this.themeService.isDark;

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
