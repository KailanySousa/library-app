import { Injectable, computed, effect, inject, signal } from '@angular/core';
import ILivro from '../interfaces/livro.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class LivroService {
  #storage = inject(LocalStorageService);
  /** Estado único em memória */
  private readonly _livros = signal<ILivro[]>(
    this.#storage.get<ILivro[]>('livros') ?? []
  );

  /** Exposição somente leitura para componentes */
  readonly livros = this._livros.asReadonly();

  /** Próximo id baseado no maior id atual (independe de ordenação) */
  private readonly proximoId = computed(() => {
    const arr = this._livros();
    if (arr.length === 0) return 1;
    const max = arr.reduce((m, l) => (l.id > m ? l.id : m), 0);
    return max + 1;
  });

  /** Persiste no LocalStorage sempre que a lista mudar */
  private readonly persistEffect = effect(() => {
    this.#storage.set<ILivro[]>('livros', this._livros());
  });

  /** Um livro por id (reativo) */
  byId(id: number) {
    return computed(() => this._livros().find((l) => l.id === id));
  }

  /** Coleção por chave/valor (reativo) */
  by<K extends keyof ILivro>(key: K, value: ILivro[K]) {
    return computed(() => this._livros().filter((l) => l[key] === value));
  }

  /** Contagem por chave/valor (reativo) */
  countBySignal<K extends keyof ILivro>(key: K, value: ILivro[K]) {
    return computed(
      () => this._livros().filter((l) => l[key] === value).length
    );
  }

  /** ---------- API compatível (snapshot) ---------- */

  getAll(): ILivro[] {
    return this._livros();
  }

  getItem(id: number): ILivro {
    return this._livros().find((l) => l.id === id)!;
  }

  getAllBy<T, K extends keyof ILivro>(key: K, value: ILivro[K]): T[] {
    return this._livros().filter((l) => l[key] === value) as T[];
  }

  getCountBy<K extends keyof ILivro>(key: K, value: ILivro[K]): number {
    return this.getAllBy(key, value).length;
  }

  /** ---------- Mutations ---------- */

  post(
    request: ILivro,
    onSucess: () => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const novo: ILivro = {
        ...request,
        id: this.proximoId(),
        createdAt: new Date().toISOString(),
      };

      this._livros.update((arr) => [...arr, novo]);
      onSucess();
    } catch (error) {
      onError(error);
    }
  }

  put(
    request: ILivro,
    onSucess: () => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const atualizado: ILivro = {
        ...request,
        updatedAt: new Date().toISOString(),
      };

      this._livros.update((arr) => {
        const idx = arr.findIndex((l) => l.id === atualizado.id);
        console.log('🚀 ~ LivroService ~ put ~ idx:', idx);
        if (idx === -1) return arr;
        const copia = arr.slice();
        copia[idx] = atualizado;
        return copia;
      });

      onSucess();
    } catch (error) {
      onError(error);
    }
  }

  delete(
    id: number,
    onSucess: () => void,
    onError: (e: unknown) => void
  ): void {
    try {
      this._livros.update((arr) => arr.filter((l) => l.id !== id));
      onSucess();
    } catch (error) {
      onError(error);
    }
  }
}
