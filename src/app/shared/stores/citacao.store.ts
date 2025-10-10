import { Injectable, computed, effect, signal, untracked } from '@angular/core';
import { BaseStore } from './base.store';
import { ICitacao } from '../interfaces/citacao.interface';

const STORAGE_KEY = 'citacoes';
@Injectable({ providedIn: 'root' })
export class CitacoesStore extends BaseStore {
  private readonly _citacoes = signal<ICitacao[]>(this.restore(STORAGE_KEY));
  readonly citacoes = this._citacoes.asReadonly();
  readonly total = computed(() => this._citacoes().length);

  private readonly persistEffect = effect(() => {
    const snapshot = this._citacoes();
    untracked(() => this.persist(STORAGE_KEY, snapshot));
  });

  constructor() {
    super();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const vindaDeOutraAba = JSON.stringify(this._citacoes()) !== e.newValue;
        if (vindaDeOutraAba)
          this._citacoes.set((JSON.parse(e.newValue) as ICitacao[]) ?? []);
      }
    });
  }

  item(citacaoId: number): ICitacao {
    return this._citacoes().find((a) => a.id === citacaoId)!;
  }

  by<K extends keyof ICitacao>(key: K, value: ICitacao[K]) {
    return this._citacoes().filter((l) => l[key] === value);
  }

  itemBy<K extends keyof ICitacao>(key: K, value: ICitacao[K]) {
    return this._citacoes().find((l) => l[key] === value);
  }

  countBy<K extends keyof ICitacao>(key: K, value: ICitacao[K]) {
    return this._citacoes().filter((l) => l[key] === value).length;
  }

  private createNew(partial: Omit<ICitacao, 'id'>) {
    const novo: ICitacao = {
      ...partial,
      id: this.nextId(),
    };

    this._citacoes.update((arr) => [...arr, novo]);

    return novo;
  }

  add(partial: Omit<ICitacao, 'id'>) {
    this.createNew(partial);
  }

  addWithReturnId(partial: Omit<ICitacao, 'id'>): number {
    const novo = this.createNew(partial);
    return novo.id;
  }

  update(id: number, patch: Partial<ICitacao>) {
    this._citacoes.update((arr) =>
      arr.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  }

  remove(id: number) {
    this._citacoes.update((arr) => arr.filter((l) => l.id !== id));
  }

  removeWithIds(ids: number[]) {
    this._citacoes.update((arr) => arr.filter((l) => !ids.includes(l.id)));
  }

  clearAll() {
    this._citacoes.set([]);
  }

  private nextId(): number {
    const arr = this._citacoes();
    return arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1;
  }
}
