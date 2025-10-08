import { inject, Pipe, PipeTransform } from '@angular/core';
import { LivroService } from '../services/livro.service';

@Pipe({
  name: 'livrosPorCategoria',
})
export class LivrosPorCategoriaPipe implements PipeTransform {
  #livroService = inject(LivroService);

  transform(id: number): number {
    return this.#livroService.getCountBy('categoriaId', id.toString());
  }
}
