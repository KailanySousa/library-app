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
import { OutrosLivrosComponent } from './outros-livros/outros-livros.component';
import { FormsModule } from '@angular/forms';
import { ICitacao } from '../../../shared/interfaces/citacao.interface';
import { CitacoesPorLivroService } from '../../../shared/services/citacoes-por-livro.service';

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
    OutrosLivrosComponent,
    FormsModule,
  ],
  templateUrl: './livro.component.html',
})
export class LivroComponent {
  livro = signal<ILivro | null>(null);
  autor = signal<IAutor | null>(null);
  outrosDoAutor = signal<ILivro[]>([]);
  outrosDaCategoria = signal<ILivro[]>([]);
  citacoes = signal<ICitacao[]>([]);

  formCitacaoAberto = signal(false as boolean);
  citacaoTexto = '';

  constructor(
    private route: ActivatedRoute,
    private livroService: LivroService,
    private autorService: AutorService,
    private readonly citacoesPorLivroService: CitacoesPorLivroService
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

      this.citacoes.set(this.citacoesPorLivroService.getCitacoesPorLivro(l.id));
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

  abrirFormCitacao() {
    this.citacaoTexto = '';
    this.formCitacaoAberto.set(true);
  }

  cancelarCitacao() {
    this.citacaoTexto = '';
    this.formCitacaoAberto.set(false);
  }

  salvarCitacao() {
    const texto = (this.citacaoTexto || '').trim();
    if (!texto) return;

    const l = this.livro();
    if (!l) return;

    this.citacoesPorLivroService.setItem(
      l.id,
      texto,
      (citacoes) => {
        this.citacoes.set(citacoes);
        this.cancelarCitacao();
      },
      (e) => console.log('Erro ao adicionar a citação', e)
    );
  }
}
