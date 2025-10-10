import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutorStore } from '../../../shared/stores/autor.store';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LivrosPorAutorPipe } from '../../../shared/pipes/livros-por-autor.pipe';
import { ListaVaziaComponent } from '../../../shared/components/lista-vazia/lista-vazia.component';

@Component({
  selector: 'app-lista-autores',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HeaderComponent,
    LivrosPorAutorPipe,
    ListaVaziaComponent,
  ],
  templateUrl: './lista.component.html',
})
export class ListaAutoresComponent {
  #autorStore = inject(AutorStore);
  #router = inject(Router);

  autores = computed(() => this.#autorStore.autores());

  remover(id: number) {
    if (confirm('Remover esta autor? (não remove livros)')) {
      this.#autorStore.remove(id);
      void this.#router.navigate(['/autores/lista']);
    }
  }
}
