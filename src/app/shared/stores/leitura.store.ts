import { Injectable, effect, signal, computed, untracked } from '@angular/core';
import { BaseStore } from './base.store';
import { ILeitura } from '../interfaces/leitura.interface';

const STORAGE_KEY = 'leituras';

@Injectable({ providedIn: 'root' })
export class LeituraStore extends BaseStore {
  private readonly _leituras = signal<ILeitura[]>(this.restore(STORAGE_KEY));
  readonly leituras = this._leituras.asReadonly();
  readonly total = computed(() => this._leituras().length);
  private readonly persistEffect = effect(() => {
    const snapshot = this._leituras();
    untracked(() => this.persist(STORAGE_KEY, snapshot));
  });

  constructor() {
    super();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const vindaDeOutraAba = JSON.stringify(this._leituras()) !== e.newValue;
        if (vindaDeOutraAba)
          this._leituras.set((JSON.parse(e.newValue) as ILeitura[]) ?? []);
      }
    });
  }

  item(livroId: number): ILeitura {
    return this._leituras().find((l) => l.id === livroId)!;
  }

  by<K extends keyof ILeitura>(key: K, value: ILeitura[K]) {
    return this._leituras().filter((l) => l[key] === value);
  }

  itemBy<K extends keyof ILeitura>(key: K, value: ILeitura[K]) {
    return this._leituras().find((l) => l[key] === value);
  }

  countBy<K extends keyof ILeitura>(key: K, value: ILeitura[K]) {
    return this._leituras().filter((l) => l[key] === value).length;
  }

  add(partial: Omit<ILeitura, 'id' | 'inicio'>) {
    const novo: ILeitura = {
      ...partial,
      id: this.nextId(),
      inicio: Date.now().toString(),
    };
    this._leituras.update((arr) => [...arr, novo]);
  }

  update(id: number, patch: Partial<ILeitura>) {
    this._leituras.update((arr) =>
      arr.map((l) =>
        l.id === id ? { ...l, ...patch, fim: Date.now().toString() } : l
      )
    );
  }

  remove(id: number) {
    this._leituras.update((arr) => arr.filter((l) => l.id !== id));
  }

  clearAll() {
    this._leituras.set([]);
  }

  private nextId(): number {
    const arr = this._leituras();
    return arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1;
  }
}
