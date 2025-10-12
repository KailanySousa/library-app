import { Component, input } from '@angular/core';
import { ICapitulo } from '../../../shared/interfaces/capitulo.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-capitulos-livro',
  imports: [RouterModule],
  templateUrl: './capitulos-livro.component.html',
})
export class CapitulosLivroComponent {
  capitulos = input.required<ICapitulo[]>();
}
