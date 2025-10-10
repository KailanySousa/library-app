import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  untracked,
} from '@angular/core';
import { ICitacaoLivro } from '../interfaces/citacao-livro';
import { ICitacao } from '../interfaces/citacao.interface';
import { CitacoesStore } from './citacao.store';
import { BaseStore } from './base.store';

const STORAGE_KEY = 'citacao_livro';

@Injectable({
  providedIn: 'root',
})
export class CitacaoLivroStore extends BaseStore {
  #citacaoStore = inject(CitacoesStore);

  private readonly _citacaoLivro = signal<ICitacaoLivro[]>(
    this.restore(STORAGE_KEY)
  );
  readonly citacaoLivro = this._citacaoLivro.asReadonly();
  readonly total = computed(() => this._citacaoLivro().length);

  private readonly persistEffect = effect(() => {
    const snapshot = this._citacaoLivro();
    untracked(() => this.persist(STORAGE_KEY, snapshot));
  });

  constructor() {
    super();

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        const vindaDeOutraAba =
          JSON.stringify(this._citacaoLivro()) !== e.newValue;
        if (vindaDeOutraAba)
          this._citacaoLivro.set(
            (JSON.parse(e.newValue) as ICitacaoLivro[]) ?? []
          );
      }
    });
  }

  item(id: number): ICitacaoLivro {
    return this._citacaoLivro().find((a) => a.id === id)!;
  }

  by<K extends keyof ICitacaoLivro>(key: K, value: ICitacaoLivro[K]) {
    return this._citacaoLivro().filter((l) => l[key] === value);
  }

  itemBy<K extends keyof ICitacaoLivro>(key: K, value: ICitacaoLivro[K]) {
    return this._citacaoLivro().find((l) => l[key] === value);
  }

  countBy<K extends keyof ICitacaoLivro>(key: K, value: ICitacaoLivro[K]) {
    return this._citacaoLivro().filter((l) => l[key] === value).length;
  }

  add(livroId: number, texto: string) {
    const citacaoId = this.#citacaoStore.addWithReturnId({ texto });

    const novo: ICitacaoLivro = {
      id: this.nextId(),
      livroId,
      citacaoId,
    };

    this._citacaoLivro.update((arr) => [...arr, novo]);
  }

  update(id: number, patch: Partial<ICitacaoLivro>) {
    this._citacaoLivro.update((arr) =>
      arr.map((l) => (l.id === id ? { ...l, ...patch } : l))
    );
  }

  remove(id: number) {
    this._citacaoLivro.update((arr) => arr.filter((l) => l.id !== id));
  }

  clearAll() {
    this._citacaoLivro.set([]);
  }

  private nextId(): number {
    const arr = this._citacaoLivro();
    return arr.length ? Math.max(...arr.map((a) => a.id)) + 1 : 1;
  }

  citacoesPorLivro(livroId: number): ICitacao[] {
    const citacoes = this._citacaoLivro().filter((c) => c.livroId == livroId);

    const citacoesLivro: ICitacao[] = [];

    citacoes.forEach((c) => {
      citacoesLivro.push(this.#citacaoStore.item(c.citacaoId));
    });

    return citacoesLivro;
  }
}
