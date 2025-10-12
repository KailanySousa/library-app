import { Component, inject, input, output } from '@angular/core';
import { ICapitulo } from '../../../shared/interfaces/capitulo.interface';
import { CommonModule } from '@angular/common';
import { CapituloStore } from '../../../shared/stores/capitulo.store';

@Component({
  selector: 'app-lista',
  imports: [CommonModule],
  templateUrl: './lista.component.html',
})
export class ListaComponent {
  capitulos = input.required<ICapitulo[]>();
  editarCapitulo = output<ICapitulo>();

  #store = inject(CapituloStore);

  editar(c: ICapitulo) {
    this.editarCapitulo.emit(c);
  }

  excluir(id: number) {
    this.#store.remove(id);
  }
}
