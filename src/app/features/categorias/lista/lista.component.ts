import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoriaStore } from '../../../shared/stores/categoria.store';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LivrosPorCategoriaPipe } from '../../../shared/pipes/livros-por-categoria.pipe';
import { ListaVaziaComponent } from '../../../shared/components/lista-vazia/lista-vazia.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HeaderComponent,
    LivrosPorCategoriaPipe,
    ListaVaziaComponent,
  ],
  templateUrl: './lista.component.html',
})
export class ListaCategoriasComponent {
  #categoriaStore = inject(CategoriaStore);
  #router = inject(Router);

  categorias = computed(() => this.#categoriaStore.categorias());

  remover(id: number) {
    if (confirm('Remover esta categoria?')) {
      this.#categoriaStore.remove(id);
      void this.#router.navigate(['/categorias/lista']);
    }
  }
}
