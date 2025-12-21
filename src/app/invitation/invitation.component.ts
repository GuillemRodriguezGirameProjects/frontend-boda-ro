import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { User, UsersService } from '../users.service';

@Component({
  standalone: true,
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss'],
  imports: [CommonModule, ThemeToggleComponent],
})
export class InvitationComponent implements OnInit, OnDestroy {
  private readonly usersService = inject(UsersService);
  private readonly route = inject(ActivatedRoute);

  user = signal<User | null>(null);
  loading = signal(true);
  updating = signal(false);
  error = signal('');
  toastMessage = signal('');
  showToast = signal(false);
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Invitació invàlida.');
      this.loading.set(false);
      return;
    }

    this.fetchUser(id);
  }

  ngOnDestroy(): void {
    this.clearToastTimer();
  }

  fetchUser(id: string): void {
    this.error.set('');
    this.loading.set(true);
    this.usersService.getUser(id).subscribe({
      next: (user) => this.user.set(user),
      error: () => this.error.set('No hem pogut carregar la teva invitació.'),
      complete: () => this.loading.set(false),
    });
  }

  updateStatus(accepted: boolean | null): void {
    const current = this.user();
    if (!current) {
      return;
    }

    this.updating.set(true);
    this.hideToast();
    this.usersService.updateUser(current.id, accepted).subscribe({
      next: (updated) => {
        this.user.set(updated);
        this.showToastMessage('La teva decisió ha quedat registrada');
      },
      error: () =>
        this.error.set(
          'No hem pogut guardar la teva resposta, intenta-ho de nou.'
        ),
      complete: () => this.updating.set(false),
    });
  }

  statusLabel(user: User | null): string {
    if (!user) {
      return 'Pendent';
    }

    if (user.accepted === true) {
      return 'Has confirmat la teva assistència';
    }

    if (user.accepted === false) {
      return 'Has rebutjat la invitació';
    }

    return 'La teva resposta continua pendent';
  }

  statusClass(user: User | null): string {
    if (!user) {
      return 'status status--pending';
    }

    if (user.accepted === true) {
      return 'status status--accepted';
    }

    if (user.accepted === false) {
      return 'status status--rejected';
    }

    return 'status status--pending';
  }

  private showToastMessage(message: string): void {
    this.toastMessage.set(message);
    this.showToast.set(true);
    this.clearToastTimer();
    this.toastTimer = setTimeout(() => this.hideToast(), 3200);
  }

  private hideToast(): void {
    this.showToast.set(false);
  }

  private clearToastTimer(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }
}
