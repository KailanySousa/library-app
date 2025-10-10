import { Injectable, effect, signal, computed, untracked } from '@angular/core';
import ILivro from '../interfaces/livro.interface';
import { BaseStore } from './base.store';

const STORAGE_KEY = 'livros';

@Injectable({ providedIn: 'root' })
export class LivroStore extends BaseStore {
  private readonly _livros = signal<ILivro[]>(this.restore(STORAGE_KEY));
  readonly livros = this._livros.asReadonly();
  readonly total = computed(() => this._livros().length);
  private readonly persistEffect = effect(() => {
    const snapshot = this._livros();
    untracked(() => this.persist(STORAGE_KEY, snapshot));
  });

  constructor() {
    super();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const vindaDeOutraAba = JSON.stringify(this._livros()) !== e.newValue;
        if (vindaDeOutraAba)
          this._livros.set((JSON.parse(e.newValue) as ILivro[]) ?? []);
      }
    });
  }

  item(livroId: number): ILivro {
    return this._livros().find((l) => l.id === livroId)!;
  }

  by<K extends keyof ILivro>(key: K, value: ILivro[K]) {
    return this._livros().filter((l) => l[key] === value);
  }

  itemBy<K extends keyof ILivro>(key: K, value: ILivro[K]) {
    return this._livros().find((l) => l[key] === value);
  }

  countBy<K extends keyof ILivro>(key: K, value: ILivro[K]) {
    return this._livros().filter((l) => l[key] === value).length;
  }

  add(partial: Omit<ILivro, 'id' | 'createdAt'>) {
    const novo: ILivro = {
      ...partial,
      id: this.nextId(),
      createdAt: Date.now().toString(),
    };
    this._livros.update((arr) => [...arr, novo]);
  }

  update(id: number, patch: Partial<ILivro>) {
    this._livros.update((arr) =>
      arr.map((l) =>
        l.id === id ? { ...l, ...patch, updatedAt: Date.now().toString() } : l
      )
    );
  }

  remove(id: number) {
    this._livros.update((arr) => arr.filter((l) => l.id !== id));
  }

  clearAll() {
    this._livros.set([]);
  }

  private nextId(): number {
    const arr = this._livros();
    return arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1;
  }
}
