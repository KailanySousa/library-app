import { Component, input, output } from '@angular/core';
import { ICapitulo } from '../../../shared/interfaces/capitulo.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista',
  imports: [CommonModule],
  templateUrl: './lista.component.html',
})
export class ListaComponent {
  capitulos = input.required<ICapitulo[]>();
  editarCapitulo = output<ICapitulo>();

  editar(c: ICapitulo) {
    this.editarCapitulo.emit(c);
  }
}
