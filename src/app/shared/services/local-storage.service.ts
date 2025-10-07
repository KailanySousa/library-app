import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  get<T>(key: string): T | undefined {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : undefined;
  }

  set<T>(key: string, data: T, list?: T[]): void {
    if (list) this.insert(list, key, data);
    if (!list) localStorage.setItem(key, JSON.stringify(data));
  }

  update<T>(key: string, data: T, list: T[]): void {
    const index = list.findIndex(
      (c) =>
        Object.hasOwn(c as object, key) &&
        Object.getOwnPropertyDescriptors(c)['id'].value ===
          Object.getOwnPropertyDescriptors(data)['id'].value
    );
    const livros = list.fill(data, index);
    this.set(key, livros);
  }

  private insert<T>(list: T[], key: string, data: T): void {
    if (list) {
      list.push(data);
      this.set(key, list);
    } else {
      this.set(key, [data]);
    }
  }
}
