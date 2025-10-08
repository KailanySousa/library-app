import { inject, Pipe, PipeTransform } from '@angular/core';
import { CategoriaService } from '../services/categoria.service';

@Pipe({
  name: 'categoria',
})
export class CategoriaPipe implements PipeTransform {
  #service = inject(CategoriaService);

  transform(id: string): string {
    return this.#service.getItem(Number.parseInt(id)).nome;
  }
}
