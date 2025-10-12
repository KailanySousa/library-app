import { Component, input } from '@angular/core';
import { CategoriaPipe } from '../../../shared/pipes/categoria.pipe';
import { AutorPipe } from '../../../shared/pipes/autor.pipe';
import ILivro from '../../../shared/interfaces/livro.interface';
import { SlicePipe, UpperCasePipe } from '@angular/common';
import { GradientePorCategoriaPipe } from '../../../shared/pipes/gradiente-por-categoria.pipe';
import { RouterModule } from '@angular/router';
import { CapitulosPipe } from '../../../shared/pipes/capitulos.pipe';

@Component({
  selector: 'app-card-livro',
  imports: [
    CategoriaPipe,
    AutorPipe,
    CapitulosPipe,
    SlicePipe,
    UpperCasePipe,
    GradientePorCategoriaPipe,
    RouterModule,
  ],
  templateUrl: './card-livro.component.html',
})
export class CardLivroComponent {
  livro = input.required<ILivro>();
}
