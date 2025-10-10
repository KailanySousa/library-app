import { inject, Pipe, PipeTransform } from '@angular/core';
import { EditoraStore } from '../stores/editora.store';

@Pipe({
  name: 'editora',
})
export class EditoraPipe implements PipeTransform {
  #store = inject(EditoraStore);
  transform(id?: string): string {
    if (!id) return '-';
    return this.#store.item(Number(id)).nome;
  }
}
