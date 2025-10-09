import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BaseStore {
  public persist<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public restore<T>(key: string): T[] {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as T[];
      return parsed ?? [];
    } catch {
      return [];
    }
  }
}
