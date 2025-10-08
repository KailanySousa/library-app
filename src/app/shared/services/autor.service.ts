import { Injectable, computed, effect, inject, signal } from '@angular/core';
import IAutor from '../interfaces/autor.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AutorService {
  #storage = inject(LocalStorageService);
  /** Estado único em memória */
  private readonly _autores = signal<IAutor[]>(
    this.#storage.get<IAutor[]>('autores') ?? []
  );

  /** Exposição somente leitura para componentes */
  readonly autores = this._autores.asReadonly();

  /** Próximo id baseado no maior id atual */
  private readonly proximoId = computed(() => {
    const arr = this._autores();
    if (arr.length === 0) return 1;
    const max = arr.reduce((m, a) => (a.id > m ? a.id : m), 0);
    return max + 1;
  });

  /** Persiste sempre que a lista mudar */
  private readonly persistEffect = effect(() => {
    this.#storage.set<IAutor[]>('autores', this._autores());
  });

  /** Selector reativo por id (útil para telas de detalhe) */
  byId(id: number) {
    return computed(() => this._autores().find((a) => a.id === id));
  }

  /** API “compatível” com a anterior */
  getAll(): IAutor[] {
    return this._autores();
  }

  getItem(id: number): IAutor {
    return this._autores().find((a) => a.id === id)!;
  }

  post(
    request: IAutor,
    onSucess: (id: number) => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const novo: IAutor = {
        ...request,
        id: this.proximoId(),
        createdAt: new Date().toISOString(),
      };

      this._autores.update((arr) => [...arr, novo]);
      onSucess(novo.id);
    } catch (error) {
      onError(error);
    }
  }

  put(
    request: IAutor,
    onSucess: () => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const atualizado: IAutor = {
        ...request,
        updatedAt: new Date().toISOString(),
      };

      this._autores.update((arr) => {
        const idx = arr.findIndex((a) => a.id === atualizado.id);
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
      this._autores.update((arr) => arr.filter((a) => a.id !== id));
      onSucess();
    } catch (error) {
      onError(error);
    }
  }
}
