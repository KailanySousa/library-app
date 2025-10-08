import { computed, Injectable } from '@angular/core';
import ILivro from '../interfaces/livro.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private proximoId = computed(() => {
    const livros = this.getAll();
    if (livros.length > 0) {
      const ultimo = livros[livros.length - 1];

      return ultimo.id + 1;
    }
    return 1;
  });

  constructor(private readonly storage: LocalStorageService) {}

  getItem(id: number): ILivro {
    return this.getAll().filter((autor: ILivro) => autor.id == id)[0];
  }

  getAll(): ILivro[] {
    const livros = this.storage.get('livros');

    if (livros) {
      return livros as ILivro[];
    }
    return [];
  }

  getAllBy<T>(key: string, value: unknown): T[] | [] {
    const livros = this.getAll();

    if (livros) {
      return livros.filter((l) => {
        return (
          Object.hasOwn(l, key) &&
          Object.getOwnPropertyDescriptors(l)[key].value === value
        );
      }) as T[];
    }
    return [];
  }

  getCountBy(key: string, value: unknown): number {
    return this.getAllBy(key, value).length;
  }

  post(
    request: ILivro,
    onSucess: () => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const livros = this.getAll();

      request.id = this.proximoId();
      request.createdAt = new Date().toString();

      this.storage.set('livros', request, livros);

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
      request.createdAt = new Date().toString();

      this.storage.update('livros', request, this.getAll());
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

      const livros = this.getAll().splice(index, 1);
      this.storage.set('livros', livros);

      onSucess();
    } catch (error) {
      onError(error);
    }
  }
}
