import { Injectable, computed, effect, inject, signal } from '@angular/core';
import ICategoria from '../interfaces/categoria.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  #storage = inject(LocalStorageService);
  /** Fonte única da verdade em memória */
  private readonly _categorias = signal<ICategoria[]>(
    this.#storage.get<ICategoria[]>('categorias') ?? []
  );

  /** Exponha como somente-leitura para os componentes */
  readonly categorias = this._categorias.asReadonly();

  /** Próximo id baseado no maior id existente (evita depender de ordenação) */
  private readonly proximoId = computed(() => {
    const arr = this._categorias();
    if (arr.length === 0) return 1;
    const max = arr.reduce((m, c) => (c.id > m ? c.id : m), 0);
    return max + 1;
  });

  /** Persiste no LocalStorage sempre que a lista mudar */
  private readonly persistEffect = effect(() => {
    this.#storage.set<ICategoria[]>('categorias', this._categorias());
  });

  constructor(private readonly storage: LocalStorageService) {}

  /** Selector computado por id — útil para binds reativos em componentes */
  byId(id: number) {
    return computed(() => this._categorias().find((c) => c.id === id));
  }

  /** Métodos “compatíveis” com a API anterior */
  getAll(): ICategoria[] {
    return this._categorias();
  }

  getItem(id: number): ICategoria {
    return this._categorias().find((c) => c.id === id)!;
  }

  post(
    request: ICategoria,
    onSucess: (id: number) => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const novo: ICategoria = {
        ...request,
        id: this.proximoId(),
        createdAt: new Date().toISOString(),
      };

      this._categorias.update((arr) => [...arr, novo]);
      onSucess(novo.id);
    } catch (error) {
      onError(error);
    }
  }

  put(
    request: ICategoria,
    onSucess: () => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const atualizado: ICategoria = {
        ...request,
        updatedAt: new Date().toISOString(),
      };

      this._categorias.update((arr) => {
        const idx = arr.findIndex((c) => c.id === atualizado.id);
        if (idx === -1) return arr; // nada a alterar
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
      this._categorias.update((arr) => arr.filter((c) => c.id !== id));
      onSucess();
    } catch (error) {
      onError(error);
    }
  }
}
