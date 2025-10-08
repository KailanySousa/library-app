import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LivroService } from '../../../shared/services/livro.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AutorPipe } from '../../../shared/pipes/autor.pipe';
import { CategoriaPipe } from '../../../shared/pipes/categoria.pipe';
import { ListaVaziaComponent } from '../../../shared/components/lista-vazia/lista-vazia.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lista-livros',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HeaderComponent,
    AutorPipe,
    CategoriaPipe,
    ListaVaziaComponent,
  ],
  templateUrl: './lista.component.html',
})
export class ListaLivrosComponent {
  #service = inject(LivroService);
  #router = inject(Router);
  readonly livros = this.#service.livros;

  remover(id: number) {
    if (confirm('Remover este livro?')) {
      this.#service.delete(
        id,
        () => void this.#router.navigate(['/livros/lista']),
        (e) => console.log('Erro ao remover o livro', e)
      );
    }
  }
}
