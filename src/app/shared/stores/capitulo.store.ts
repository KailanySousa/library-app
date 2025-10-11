import { Injectable, computed, effect, signal, untracked } from '@angular/core';
import { BaseStore } from './base.store';
import { ICapitulo } from '../interfaces/capitulo.interface';

const STORAGE_KEY = 'capitulos';
@Injectable({ providedIn: 'root' })
export class CapituloStore extends BaseStore {
  private readonly _capitulos = signal<ICapitulo[]>(this.restore(STORAGE_KEY));
  readonly capitulos = this._capitulos.asReadonly();
  readonly total = computed(() => this._capitulos().length);

  private readonly persistEffect = effect(() => {
    const snapshot = this._capitulos();
    untracked(() => this.persist(STORAGE_KEY, snapshot));
  });

  constructor() {
    super();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const vindaDeOutraAba =
          JSON.stringify(this._capitulos()) !== e.newValue;
        if (vindaDeOutraAba)
          this._capitulos.set((JSON.parse(e.newValue) as ICapitulo[]) ?? []);
      }
    });
  }

  item(capituloId: number): ICapitulo {
    return this._capitulos().find((a) => a.id === capituloId)!;
  }

  by<K extends keyof ICapitulo>(key: K, value: ICapitulo[K]) {
    return this._capitulos().filter((l) => l[key] === value);
  }

  itemBy<K extends keyof ICapitulo>(key: K, value: ICapitulo[K]) {
    return this._capitulos().find((l) => l[key] === value);
  }

  countBy<K extends keyof ICapitulo>(key: K, value: ICapitulo[K]) {
    return this._capitulos().filter((l) => l[key] === value).length;
  }

  add(partial: Omit<ICapitulo, 'id'>) {
    const novo: ICapitulo = {
      ...partial,
      id: this.nextId(),
    };

    this._capitulos.update((arr) => [...arr, novo]);
  }

  update(id: number, patch: Partial<ICapitulo>) {
    this._capitulos.update((arr) =>
      arr.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  }

  remove(id: number) {
    this._capitulos.update((arr) => arr.filter((l) => l.id !== id));
  }

  removeAllBy(livroId: number) {
    const capitulos = this._capitulos().filter((l) => l.livroId === livroId);
    if (capitulos) {
      this._capitulos.update((arr) => arr.filter((l) => l.livroId !== livroId));
    }
  }

  clearAll() {
    this._capitulos.set([]);
  }

  private nextId(): number {
    const arr = this._capitulos();
    return arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1;
  }
}
