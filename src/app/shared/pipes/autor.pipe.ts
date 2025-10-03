import { inject, Pipe, PipeTransform } from '@angular/core';
import { AutorService } from '../services/autor.service';

@Pipe({
  name: 'autor',
})
export class AutorPipe implements PipeTransform {
  #service = inject(AutorService);
  transform(id: number): string {
    return this.#service.getItem(id).nome;
  }
}
