import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AutorService } from '../../../shared/services/autor.service';
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
import { CitacoesPorLivroService } from '../../../shared/services/citacoes-por-livro.service';
import { LivroStore } from '../../../shared/stores/livro.store';

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
  #livroStore = inject(LivroStore);
  #citacoesPorLivroService = inject(CitacoesPorLivroService);

  id = input(0, { transform: numberAttribute });

  livro = computed(() => this.#livroStore.getItem(this.id()));

  autor = computed(() =>
    this.autorService.getItem(Number(this.livro().autorId))
  );
  outrosDoAutor = computed(() =>
    this.#livroStore
      .by('autorId', this.livro().autorId)
      .filter((l) => l.id !== this.livro().id)
  );
  outrosDaCategoria = computed(() =>
    this.#livroStore
      .by('categoriaId', this.livro().autorId)
      .filter((l) => l.id !== this.livro().id)
  );
  citacoes = computed(() =>
    this.#citacoesPorLivroService.getCitacoesPorLivro(this.livro().id)
  );

  formCitacaoAberto = signal(false as boolean);
  citacaoTexto = '';

  constructor(private autorService: AutorService) {}

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

    this.#citacoesPorLivroService.setItem(
      l.id,
      texto,
      () => {
        // this.citacoes.set(citacoes);
        this.cancelarCitacao();
      },
      (e) => console.log('Erro ao adicionar a citação', e)
    );
  }
}
