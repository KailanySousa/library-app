import { inject, Pipe, PipeTransform } from '@angular/core';
import { LivroService } from '../services/livro.service';

@Pipe({
  name: 'livrosPorAutor',
})
export class LivrosPorAutorPipe implements PipeTransform {
  #livroService = inject(LivroService);

  transform(id: number): unknown {
    return this.#livroService.getCountBy('autorId', id.toString());
  }
}
