import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { EStatus } from '../../shared/enums/status.enum';
import { CardLivroComponent } from './card-livro/card-livro.component';
import { ListaVaziaComponent } from '../../shared/components/lista-vazia/lista-vazia.component';
import { LivroStore } from '../../shared/stores/livro.store';
import ILivro from '../../shared/interfaces/livro.interface';

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

  lidos!: ILivro[];
  desejos!: ILivro[];
  lendo!: ILivro[];
  setData = effect(() => {
    this.lidos = this.#livroStore.by('status', EStatus.LIDO);
    this.desejos = this.#livroStore.by('status', EStatus.DESEJO);
    this.lendo = this.#livroStore.by('status', EStatus.LENDO);
  });
}
