import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import ILivro from '../../../../shared/interfaces/livro.interface';

@Component({
  selector: 'app-outros-livros',
  imports: [RouterModule],
  templateUrl: './outros-livros.component.html',
})
export class OutrosLivrosComponent {
  outros = input.required<ILivro[]>();
}
