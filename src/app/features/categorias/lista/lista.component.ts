import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoriaService } from '../../../shared/services/categoria.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LivrosPorCategoriaPipe } from '../../../shared/pipes/livros-por-categoria.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HeaderComponent,
    LivrosPorCategoriaPipe,
  ],
  templateUrl: './lista.component.html',
})
export class ListaCategoriasComponent {
  #service = inject(CategoriaService);
  #router = inject(Router);

  readonly categorias = this.#service.categorias;

  remover(id: number) {
    if (confirm('Remover esta categoria?')) {
      this.#service.delete(
        id,
        () => void this.#router.navigate(['/categorias/lista']),
        (e) => console.log('Erro ao remover a categoria', e)
      );
    }
  }
}
