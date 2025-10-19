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
import { EStatus } from '../../shared/enums/status.enum';

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
  EStatus = EStatus;
  #livroStore = inject(LivroStore);
  #leituraStore = inject(LeituraStore);

  lendo = computed(() => {
    const leiturasAndamento = this.#leituraStore
      .by('status', EStatus.LENDO)
      .flatMap(
        (l) => (l.status === EStatus.LENDO ? l.livroId : null),
        'livroId'
      )
      .filter((l) => l !== null);

    return leiturasAndamento.map((livroId) => this.#livroStore.item(livroId));
  });
  lidos = computed(() => {
    const leiturasFinalizadas = this.#leituraStore
      .by('status', EStatus.FINALIZADO)
      .flatMap(
        (l) => (l.status === EStatus.FINALIZADO ? l.livroId : null),
        'livroId'
      )
      .filter((l) => l !== null);

    return leiturasFinalizadas.map((livroId) => this.#livroStore.item(livroId));
  });

  iniciar = computed(() => {
    return this.#livroStore
      .livros()
      .map((livro) => {
        const leitura = this.#leituraStore.itemBy('livroId', livro.id);
        if (!leitura) return livro;
        return null;
      })
      .filter((l) => l !== null);
  });
}
