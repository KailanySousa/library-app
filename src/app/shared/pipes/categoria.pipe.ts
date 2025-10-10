import { inject, Pipe, PipeTransform } from '@angular/core';
import { CategoriaStore } from '../stores/categoria.store';

@Pipe({
  name: 'categoria',
})
export class CategoriaPipe implements PipeTransform {
  #categoriaStore = inject(CategoriaStore);

  transform(id: string): string {
    return this.#categoriaStore.item(Number(id)).nome;
  }
}
