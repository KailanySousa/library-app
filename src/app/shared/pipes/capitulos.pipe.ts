import { inject, Pipe, PipeTransform } from '@angular/core';
import { CapituloStore } from '../stores/capitulo.store';

@Pipe({
  name: 'capitulos',
})
export class CapitulosPipe implements PipeTransform {
  #store = inject(CapituloStore);
  transform(livroId: number): number {
    return this.#store.countBy('livroId', livroId);
  }
}
