import {
  ChangeDetectionStrategy,
  Component,
  computed,
  // computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CardLivroComponent } from './card-livro/card-livro.component';
import { ListaVaziaComponent } from '../../shared/components/lista-vazia/lista-vazia.component';
import { LivroStore } from '../../shared/stores/livro.store';
import { LeituraStore } from '../../shared/stores/leitura.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-explorar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    CardLivroComponent,
    ListaVaziaComponent,
  ],
  templateUrl: './explorar.component.html',
})
export class ExplorarComponent {
  #livroStore = inject(LivroStore);
  #leituraStore = inject(LeituraStore);

  lendo = computed(() => {
    const leiturasAndamento = this.#leituraStore
      .by('status', 'lendo')
      .flatMap((l) => (l.status === 'lendo' ? l.livroId : null), 'livroId')
      .filter((l) => l !== null);

    return leiturasAndamento
      .map((livroId) => this.#livroStore.item(livroId))
      .slice(0, 3);
  });
  lidos = computed(() => {
    const leiturasFinalizadas = this.#leituraStore
      .by('status', 'finalizado')
      .flatMap((l) => (l.status === 'finalizado' ? l.livroId : null), 'livroId')
      .filter((l) => l !== null);

    return leiturasFinalizadas
      .map((livroId) => this.#livroStore.item(livroId))
      .slice(0, 3);
  });

  iniciar = computed(() => {
    return this.#livroStore
      .livros()
      .map((livro) => {
        const leitura = this.#leituraStore.itemBy('livroId', livro.id);
        if (!leitura) return livro;
        return null;
      })
      .filter((l) => l !== null)
      .slice(0, 3);
  });
}
