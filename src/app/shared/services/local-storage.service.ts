import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  get<T>(key: string): T | undefined {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : undefined;
  }

  set<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
