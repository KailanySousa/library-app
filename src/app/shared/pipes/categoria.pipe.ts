import { inject, Pipe, PipeTransform } from '@angular/core';
import { CategoriaService } from '../services/categoria.service';

@Pipe({
  name: 'categoria',
})
export class CategoriaPipe implements PipeTransform {
  #service = inject(CategoriaService);

  transform(id: number): string {
    return this.#service.getItem(id).nome;
  }
}
