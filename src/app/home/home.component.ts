import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { User, UsersService } from '../users.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly pageSize = 6;

  users = signal<User[]>([]);
  loading = signal(false);
  error = signal('');
  searchName = signal('');
  page = signal(1);
  bulkInput = signal('');
  bulkSubmitting = signal(false);
  bulkError = signal('');
  bulkMessage = signal('');
  private readonly filteredUsers = computed(() => {
    const needle = this.searchName().trim().toLowerCase();
    if (!needle) {
      return this.users();
    }

    return this.users().filter((guest) =>
      guest.name.toLowerCase().includes(needle)
    );
  });
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredUsers().length / this.pageSize))
  );
  readonly currentPage = computed(() =>
    Math.min(Math.max(1, this.page()), this.totalPages())
  );
  readonly paginatedUsers = computed(() => {
    const current = this.currentPage();
    const start = (current - 1) * this.pageSize;
    return this.filteredUsers().slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.error.set('');
    this.loading.set(true);
    this.usersService.listUsers().subscribe({
      next: (users) => this.users.set(users),
      error: () =>
        this.error.set("No hem pogut carregar la llista d'invitats."),
      complete: () => this.loading.set(false),
    });
  }

  invitationUrl(id: string): string {
    return this.router.createUrlTree(['/invitations', id]).toString();
  }

  navigateToInvitation(id: string): void {
    this.router.navigate(['/invitations', id]);
  }

  setSearch(value: string): void {
    this.searchName.set(value || '');
    this.page.set(1);
  }

  changePage(delta: number): void {
    const target = this.currentPage() + delta;
    this.page.set(Math.min(Math.max(1, target), this.totalPages()));
  }

  displayStatus(user: User | null): string {
    if (!user) {
      return 'Pendent';
    }

    if (user.accepted === true) {
      return 'Confirmat';
    }

    if (user.accepted === false) {
      return 'Rebutjat';
    }

    return 'Pendent';
  }

  statusClass(user: User): string {
    if (user.accepted === true) {
      return 'status status--accepted';
    }

    if (user.accepted === false) {
      return 'status status--rejected';
    }

    return 'status status--pending';
  }

  setBulkInput(value: string): void {
    this.bulkInput.set(value || '');
    this.bulkError.set('');
    this.bulkMessage.set('');
  }

  submitBulkUsers(): void {
    const names = this.normalizeBulkInput(this.bulkInput());
    if (!names.length) {
      this.bulkError.set('Introdueix almenys un nom vàlid.');
      this.bulkMessage.set('');
      return;
    }

    this.bulkError.set('');
    this.bulkMessage.set('');
    this.bulkSubmitting.set(true);

    this.usersService
      .createUsers(names)
      .pipe(finalize(() => this.bulkSubmitting.set(false)))
      .subscribe({
        next: (created) => {
          this.bulkMessage.set(`S'han registrat ${created.length} convidats.`);
          this.bulkInput.set('');
          this.loadUsers();
        },
        error: () => {
          this.bulkError.set('No hem pogut afegir els convidats. Torna-ho a intentar.');
        },
      });
  }

  private normalizeBulkInput(value: string): string[] {
    return value
      .split(/[\n,]+/)
      .map((entry) => entry.trim())
      .filter((entry): entry is string => entry.length > 0);
  }
}
