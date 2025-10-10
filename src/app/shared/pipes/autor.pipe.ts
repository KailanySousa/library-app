import { inject, Pipe, PipeTransform } from '@angular/core';
import { AutorStore } from '../stores/autor.store';

@Pipe({
  name: 'autor',
})
export class AutorPipe implements PipeTransform {
  #store = inject(AutorStore);
  transform(id: string): string {
    return this.#store.item(Number(id)).nome;
  }
}
