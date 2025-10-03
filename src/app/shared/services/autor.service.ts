import { computed, Injectable } from '@angular/core';
import IAutor from '../interfaces/autor.interface';

@Injectable({
  providedIn: 'root',
})
export class AutorService {
  private proximoId = computed(() => {
    const autores = this.getAll();
    if (autores.length > 0) {
      const ultimo = autores[autores.length - 1];

      return ultimo.id + 1;
    }
    return 1;
  });

  constructor() {}

  getItem(id: number): IAutor {
    return this.getAll().filter((autor: IAutor) => autor.id == id)[0];
  }

  getAll(): IAutor[] {
    const autores = localStorage.getItem('autores');

    if (autores) {
      return JSON.parse(autores) as IAutor[];
    }
    return [];
  }

  post(
    request: IAutor,
    onSucess: () => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const autores = this.getAll();

      request.id = this.proximoId();

      if (autores) {
        autores.push(request);
        localStorage.setItem('autores', JSON.stringify(autores));
      } else {
        localStorage.setItem('autores', JSON.stringify([request]));
      }

      onSucess();
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
      const autores = this.getAll().map((c) => {
        if (c.id === request.id) {
          c = request;
        }
      });

      localStorage.setItem('autores', JSON.stringify(autores));
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

      const autores = this.getAll().splice(index, 1);
      localStorage.setItem('autores', JSON.stringify(autores));

      onSucess();
    } catch (error) {
      onError(error);
    }
  }
}
