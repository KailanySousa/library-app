import { computed, Injectable } from '@angular/core';
import ICategoria from '../interfaces/categoria.interface';

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

  constructor() {}

  getItem(id: number): ICategoria {
    return this.getAll().filter(
      (categoria: ICategoria) => categoria.id == id
    )[0];
  }

  getAll(): ICategoria[] {
    const categorias = localStorage.getItem('categorias');

    if (categorias) {
      return JSON.parse(categorias) as ICategoria[];
    }
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
        localStorage.setItem('categorias', JSON.stringify(categorias));
      } else {
        localStorage.setItem('categorias', JSON.stringify([request]));
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
      const categorias = this.getAll().map((c) => {
        if (c.id === request.id) {
          c = request;
        }
      });

      localStorage.setItem('categorias', JSON.stringify(categorias));
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
      localStorage.setItem('categorias', JSON.stringify(categorias));

      onSucess();
    } catch (error) {
      onError(error);
    }
  }
}
