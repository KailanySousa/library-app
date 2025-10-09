import { inject, Pipe, PipeTransform } from '@angular/core';
import { LivroStore } from '../stores/livro.store';

@Pipe({
  name: 'livrosPorAutor',
})
export class LivrosPorAutorPipe implements PipeTransform {
  #livroStore = inject(LivroStore);

  transform(id: number): number {
    return this.#livroStore.countBy('autorId', id.toString());
  }
}
