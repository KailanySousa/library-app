import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AutorPipe } from '../../../shared/pipes/autor.pipe';
import { CategoriaPipe } from '../../../shared/pipes/categoria.pipe';
import { ListaVaziaComponent } from '../../../shared/components/lista-vazia/lista-vazia.component';
import { StatusPipe } from '../../../shared/pipes/status.pipe';
import { LivroStore } from '../../../shared/stores/livro.store';

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
    StatusPipe,
  ],
  templateUrl: './lista.component.html',
})
export class ListaLivrosComponent {
  #livroStore = inject(LivroStore);
  readonly livros = computed(() => this.#livroStore.livros());

  remover(id: number) {
    if (confirm('Remover este livro?')) {
      this.#livroStore.remove(id);
    }
  }
}
