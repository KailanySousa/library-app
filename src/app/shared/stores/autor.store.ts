import { Injectable, computed, effect, signal, untracked } from '@angular/core';
import IAutor from '../interfaces/autor.interface';
import { BaseStore } from './base.store';

const STORAGE_KEY = 'autores';
@Injectable({ providedIn: 'root' })
export class AutorStore extends BaseStore {
  private readonly _autores = signal<IAutor[]>(this.restore(STORAGE_KEY));
  readonly autores = this._autores.asReadonly();
  readonly total = computed(() => this._autores().length);

  private readonly persistEffect = effect(() => {
    const snapshot = this._autores();
    untracked(() => this.persist(STORAGE_KEY, snapshot));
  });

  constructor() {
    super();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const vindaDeOutraAba = JSON.stringify(this._autores()) !== e.newValue;
        if (vindaDeOutraAba)
          this._autores.set((JSON.parse(e.newValue) as IAutor[]) ?? []);
      }
    });
  }

  item(autorId: number): IAutor {
    return this._autores().find((a) => a.id === autorId)!;
  }

  by<K extends keyof IAutor>(key: K, value: IAutor[K]) {
    return this._autores().filter((l) => l[key] === value);
  }

  itemBy<K extends keyof IAutor>(key: K, value: IAutor[K]) {
    return this._autores().find((l) => l[key] === value);
  }

  countBy<K extends keyof IAutor>(key: K, value: IAutor[K]) {
    return this._autores().filter((l) => l[key] === value).length;
  }

  private createNew(partial: Omit<IAutor, 'id' | 'createdAt'>) {
    const novo: IAutor = {
      ...partial,
      id: this.nextId(),
      createdAt: Date.now().toString(),
    };

    this._autores.update((arr) => [...arr, novo]);

    return novo;
  }

  add(partial: Omit<IAutor, 'id' | 'createdAt'>) {
    this.createNew(partial);
  }

  addWithReturnId(partial: Omit<IAutor, 'id' | 'createdAt'>): number {
    const novo = this.createNew(partial);
    return novo.id;
  }

  update(id: number, patch: Partial<IAutor>) {
    this._autores.update((arr) =>
      arr.map((l) =>
        l.id === id ? { ...l, ...patch, updatedAt: Date.now().toString() } : l
      )
    );
  }

  remove(id: number) {
    this._autores.update((arr) => arr.filter((l) => l.id !== id));
  }

  clearAll() {
    this._autores.set([]);
  }

  private nextId(): number {
    const arr = this._autores();
    return arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1;
  }
}
