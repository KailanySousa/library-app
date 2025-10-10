import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AutorStore } from '../../../shared/stores/autor.store';
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
import { CitacaoLivroStore } from '../../../shared/stores/citacao-livro.store';
import { LivroStore } from '../../../shared/stores/livro.store';
import ILivro from '../../../shared/interfaces/livro.interface';
import IAutor from '../../../shared/interfaces/autor.interface';

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
  #autorStore = inject(AutorStore);
  #citacaoLivroStore = inject(CitacaoLivroStore);

  id = input(0, { transform: numberAttribute });

  livro!: ILivro;
  autor!: IAutor;
  outrosDoAutor!: ILivro[];
  outrosDaCategoria!: ILivro[];
  readonly setUp = effect(() => {
    this.livro = this.#livroStore.item(this.id());
    this.autor = this.#autorStore.item(Number(this.livro.autorId));
    this.outrosDoAutor = this.#livroStore
      .by('autorId', this.livro.autorId)
      .filter((l) => l.id !== this.livro.id);
    this.outrosDaCategoria = this.#livroStore.by(
      'categoriaId',
      this.livro.autorId
    );
  });

  citacoes = computed(() =>
    this.#citacaoLivroStore.citacoesPorLivro(this.livro.id)
  );

  formCitacaoAberto = signal(false as boolean);
  citacaoTexto = '';

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

    const l = this.livro;
    if (!l) return;

    this.#citacaoLivroStore.add(l.id, texto);
    this.cancelarCitacao();
  }
}
