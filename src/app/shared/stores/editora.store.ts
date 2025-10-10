import { Injectable, computed, effect, signal, untracked } from '@angular/core';
import { BaseStore } from './base.store';
import IEditora from '../interfaces/editora.interface';

const STORAGE_KEY = 'editoras';
@Injectable({ providedIn: 'root' })
export class EditoraStore extends BaseStore {
  private readonly _editoras = signal<IEditora[]>(this.restore(STORAGE_KEY));
  readonly editoras = this._editoras.asReadonly();
  readonly total = computed(() => this._editoras().length);

  private readonly persistEffect = effect(() => {
    const snapshot = this._editoras();
    untracked(() => this.persist(STORAGE_KEY, snapshot));
  });

  constructor() {
    super();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const vindaDeOutraAba = JSON.stringify(this._editoras()) !== e.newValue;
        if (vindaDeOutraAba)
          this._editoras.set((JSON.parse(e.newValue) as IEditora[]) ?? []);
      }
    });
  }

  item(editoraId: number): IEditora {
    return this._editoras().find((a) => a.id === editoraId)!;
  }

  by<K extends keyof IEditora>(key: K, value: IEditora[K]) {
    return this._editoras().filter((l) => l[key] === value);
  }

  itemBy<K extends keyof IEditora>(key: K, value: IEditora[K]) {
    return this._editoras().find((l) => l[key] === value);
  }

  countBy<K extends keyof IEditora>(key: K, value: IEditora[K]) {
    return this._editoras().filter((l) => l[key] === value).length;
  }

  private createNew(partial: Omit<IEditora, 'id' | 'createdAt'>) {
    const novo: IEditora = {
      ...partial,
      id: this.nextId(),
      createdAt: Date.now().toString(),
    };

    this._editoras.update((arr) => [...arr, novo]);

    return novo;
  }

  add(partial: Omit<IEditora, 'id' | 'createdAt'>) {
    this.createNew(partial);
  }

  addWithReturnId(partial: Omit<IEditora, 'id' | 'createdAt'>): number {
    const novo = this.createNew(partial);
    return novo.id;
  }

  update(id: number, patch: Partial<IEditora>) {
    this._editoras.update((arr) =>
      arr.map((l) =>
        l.id === id ? { ...l, ...patch, updatedAt: Date.now().toString() } : l
      )
    );
  }

  remove(id: number) {
    this._editoras.update((arr) => arr.filter((l) => l.id !== id));
  }

  clearAll() {
    this._editoras.set([]);
  }

  private nextId(): number {
    const arr = this._editoras();
    return arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1;
  }
}
