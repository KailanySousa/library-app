import { Component, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LivroService } from '../../../shared/services/livro.service';
import { AutorService } from '../../../shared/services/autor.service';
import IAutor from '../../../shared/interfaces/autor.interface';
import ILivro from '../../../shared/interfaces/livro.interface';
import { CommonModule } from '@angular/common';
import { CategoriaPipe } from '../../../shared/pipes/categoria.pipe';
import { GradientePorCategoriaPipe } from '../../../shared/pipes/gradiente-por-categoria.pipe';
import {
  StatusPipe,
  StatusHeaderPipe,
} from '../../../shared/pipes/status.pipe';
import { EStatus } from '../../../shared/enums/status.enum';

@Component({
  selector: 'app-livro',
  imports: [
    RouterModule,
    HeaderComponent,
    CommonModule,
    CategoriaPipe,
    GradientePorCategoriaPipe,
    StatusHeaderPipe,
    StatusPipe,
  ],
  templateUrl: './livro.component.html',
})
export class LivroComponent {
  livro = signal<ILivro | null>(null);
  autor = signal<IAutor | null>(null);
  outrosDoAutor = signal<ILivro[]>([]);
  outrosDaCategoria = signal<ILivro[]>([]);
  citacoes = signal<string[]>([]);

  constructor(
    private route: ActivatedRoute,
    private livroService: LivroService,
    private autorService: AutorService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const l = this.livroService.getItem(id);
    this.livro.set(l);

    if (l) {
      const a = this.autorService.getItem(Number.parseInt(l.autorId));
      this.autor.set(a || null);

      this.outrosDoAutor.set(
        (
          this.livroService.getAllBy<ILivro, 'autorId'>('autorId', l.autorId) ||
          []
        ).filter((x) => x.id !== l.id)
      );
      this.outrosDaCategoria.set(
        (
          this.livroService.getAllBy<ILivro, 'categoriaId'>(
            'categoriaId',
            l.categoriaId
          ) || []
        ).filter((x) => x.id !== l.id)
      );

      // Se seu modelo já possuir "citacoes" como string[]; se não, remova/ajuste.
      // this.citacoes.set(
      //   Array.isArray((l as any).citacoes) ? (l as any).citacoes : []
      // );
    }
  }

  badgeClasses(status?: string) {
    return {
      'bg-emerald-50 text-emerald-700 border-emerald-200':
        status === EStatus.LIDO,
      'bg-amber-50 text-amber-700 border-amber-200': status === EStatus.LENDO,
      'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200':
        status === EStatus.DESEJO,
    };
  }
  dotClasses(status?: string) {
    return {
      'bg-emerald-600': status === EStatus.LIDO,
      'bg-amber-600': status === EStatus.LENDO,
      'bg-fuchsia-600': status === EStatus.DESEJO,
    };
  }
}
