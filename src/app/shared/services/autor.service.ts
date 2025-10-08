import { computed, Injectable } from '@angular/core';
import IAutor from '../interfaces/autor.interface';
import { LocalStorageService } from './local-storage.service';

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

  constructor(private readonly storage: LocalStorageService) {}

  getItem(id: number): IAutor {
    return this.getAll().filter((autor: IAutor) => autor.id == id)[0];
  }

  getAll(): IAutor[] {
    const autores = this.storage.get('autores');

    if (autores) {
      return autores as IAutor[];
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
      request.createdAt = new Date().toString();

      if (autores) {
        autores.push(request);
        this.storage.set('autores', autores);
      } else {
        this.storage.set('autores', [request]);
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
      request.createdAt = new Date().toString();

      const index = this.getAll().findIndex((c) => c.id === request.id);
      const autores = this.getAll().fill(request, index);
      this.storage.set('autores', autores);
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
      this.storage.set('autores', autores);

      onSucess();
    } catch (error) {
      onError(error);
    }
  }
}
