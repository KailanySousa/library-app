import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { EStatus } from '../../shared/enums/status.enum';
import { CardLivroComponent } from './card-livro/card-livro.component';
import { ListaVaziaComponent } from '../../shared/components/lista-vazia/lista-vazia.component';
import { LivroStore } from '../../shared/stores/livro.store';

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
  readonly EStatus = EStatus;
  #livroStore = inject(LivroStore);

  lidos = computed(() => this.#livroStore.by('status', EStatus.LIDO));
  desejos = computed(() => this.#livroStore.by('status', EStatus.DESEJO));
  lendo = computed(() => this.#livroStore.by('status', EStatus.LENDO));
}
