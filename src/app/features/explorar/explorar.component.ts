import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { EStatus } from '../../shared/enums/status.enum';
import { LivroService } from '../../shared/services/livro.service';
import ILivro from '../../shared/interfaces/livro.interface';
import { CardLivroComponent } from './card-livro/card-livro.component';
import { ListaVaziaComponent } from '../../shared/components/lista-vazia/lista-vazia.component';

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
export class ExplorarComponent implements OnInit {
  readonly EStatus = EStatus;
  jaLidos: ILivro[] = [];
  desejos: ILivro[] = [];
  lendo: ILivro[] = [];

  #livroService = inject(LivroService);

  ngOnInit() {
    this.jaLidos = this.#livroService.getAllBy('status', EStatus.LIDO);
    this.desejos = this.#livroService.getAllBy('status', EStatus.DESEJO);
    this.lendo = this.#livroService.getAllBy('status', EStatus.LENDO);
  }
}
