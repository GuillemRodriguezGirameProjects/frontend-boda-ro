import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { backendUrl } from './app.config';

export interface User {
  id: string;
  name: string;
  accepted: boolean | null;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly baseUrl = `${backendUrl}/users`;

  constructor(private readonly http: HttpClient) {}

  listUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  updateUser(id: string, accepted: boolean | null): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, { accepted });
  }

  createUsers(names: string[]): Observable<User[]> {
    return this.http.post<User[]>(this.baseUrl, { names });
  }
}
