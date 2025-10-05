import { computed, Injectable } from '@angular/core';
import ICategoria from '../interfaces/categoria.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private proximoId = computed(() => {
    const categorias = this.getAll();
    if (categorias.length > 0) {
      const ultima = categorias[categorias.length - 1];

      return ultima.id + 1;
    }
    return 1;
  });

  constructor(private readonly storage: LocalStorageService) {}

  getItem(id: number): ICategoria {
    return this.getAll().filter(
      (categoria: ICategoria) => categoria.id == id
    )[0];
  }

  getAll(): ICategoria[] {
    const categorias = this.storage.get<ICategoria[]>('categorias');
    if (categorias) return categorias;
    return [];
  }

  post(
    request: ICategoria,
    onSucess: () => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const categorias = this.getAll();

      request.id = this.proximoId();

      if (categorias) {
        categorias.push(request);
        this.storage.set<ICategoria[]>('categorias', categorias);
      } else {
        this.storage.set<ICategoria[]>('categorias', [request]);
      }

      onSucess();
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
      const index = this.getAll().findIndex((c) => c.id === request.id);
      const categorias = this.getAll().fill(request, index);
      this.storage.set<ICategoria[]>('categorias', categorias);
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
      const index = this.getAll().findIndex((c) => c.id === id);
      const categorias = this.getAll().splice(index, 1);
      this.storage.set<ICategoria[]>('categorias', categorias);

      onSucess();
    } catch (error) {
      onError(error);
    }
  }
}
