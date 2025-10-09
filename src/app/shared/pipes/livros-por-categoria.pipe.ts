import { inject, Pipe, PipeTransform } from '@angular/core';
import { LivroStore } from '../stores/livro.store';

@Pipe({
  name: 'livrosPorCategoria',
})
export class LivrosPorCategoriaPipe implements PipeTransform {
  #livroStore = inject(LivroStore);

  transform(id: number): number {
    return this.#livroStore.countBy('categoriaId', id.toString());
  }
}
