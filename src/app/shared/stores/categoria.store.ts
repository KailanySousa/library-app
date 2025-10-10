import { Injectable, computed, effect, signal, untracked } from '@angular/core';
import { BaseStore } from './base.store';
import ICategoria from '../interfaces/categoria.interface';

const STORAGE_KEY = 'categorias';
@Injectable({ providedIn: 'root' })
export class CategoriaStore extends BaseStore {
  private readonly _categorias = signal<ICategoria[]>(
    this.restore(STORAGE_KEY)
  );
  readonly categorias = this._categorias.asReadonly();
  readonly total = computed(() => this._categorias().length);

  private readonly persistEffect = effect(() => {
    const snapshot = this._categorias();
    untracked(() => this.persist(STORAGE_KEY, snapshot));
  });

  constructor() {
    super();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const vindaDeOutraAba =
          JSON.stringify(this._categorias()) !== e.newValue;
        if (vindaDeOutraAba)
          this._categorias.set((JSON.parse(e.newValue) as ICategoria[]) ?? []);
      }
    });
  }

  item(categoriaId: number): ICategoria {
    return this._categorias().find((a) => a.id === categoriaId)!;
  }

  by<K extends keyof ICategoria>(key: K, value: ICategoria[K]) {
    return this._categorias().filter((l) => l[key] === value);
  }

  itemBy<K extends keyof ICategoria>(key: K, value: ICategoria[K]) {
    return this._categorias().find((l) => l[key] === value);
  }

  countBy<K extends keyof ICategoria>(key: K, value: ICategoria[K]) {
    return this._categorias().filter((l) => l[key] === value).length;
  }

  private createNew(partial: Omit<ICategoria, 'id' | 'createdAt'>) {
    const novo: ICategoria = {
      ...partial,
      id: this.nextId(),
      createdAt: Date.now().toString(),
    };

    this._categorias.update((arr) => [...arr, novo]);

    return novo;
  }

  add(partial: Omit<ICategoria, 'id' | 'createdAt'>) {
    this.createNew(partial);
  }

  addWithReturnId(partial: Omit<ICategoria, 'id' | 'createdAt'>): number {
    const novo = this.createNew(partial);
    return novo.id;
  }

  update(id: number, patch: Partial<ICategoria>) {
    this._categorias.update((arr) =>
      arr.map((l) =>
        l.id === id ? { ...l, ...patch, updatedAt: Date.now().toString() } : l
      )
    );
  }

  remove(id: number) {
    this._categorias.update((arr) => arr.filter((l) => l.id !== id));
  }

  clearAll() {
    this._categorias.set([]);
  }

  private nextId(): number {
    const arr = this._categorias();
    return arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1;
  }
}
