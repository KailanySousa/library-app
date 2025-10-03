import { computed, Injectable } from '@angular/core';
import ILivro from '../interfaces/livro.interface';

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

  constructor() {}

  getItem(id: number): ILivro {
    return this.getAll().filter((autor: ILivro) => autor.id == id)[0];
  }

  getAll(): ILivro[] {
    const livros = localStorage.getItem('livros');

    if (livros) {
      return JSON.parse(livros) as ILivro[];
    }
    return [];
  }

  post(
    request: ILivro,
    onSucess: () => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const livros = this.getAll();

      request.id = this.proximoId();

      if (livros) {
        livros.push(request);
        localStorage.setItem('livros', JSON.stringify(livros));
      } else {
        localStorage.setItem('livros', JSON.stringify([request]));
      }

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
      const livros = this.getAll().map((c) => {
        if (c.id === request.id) {
          c = request;
        }
      });

      localStorage.setItem('livros', JSON.stringify(livros));
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
      localStorage.setItem('livros', JSON.stringify(livros));

      onSucess();
    } catch (error) {
      onError(error);
    }
  }
}
