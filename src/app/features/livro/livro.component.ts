import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { AutorStore } from '../../shared/stores/autor.store';
import { CommonModule } from '@angular/common';
import { CategoriaPipe } from '../../shared/pipes/categoria.pipe';
import { GradientePorCategoriaPipe } from '../../shared/pipes/gradiente-por-categoria.pipe';
import { EStatus } from '../../shared/enums/status.enum';
import { OutrosLivrosComponent } from './outros-livros/outros-livros.component';
import { FormsModule } from '@angular/forms';
import { LivroStore } from '../../shared/stores/livro.store';
import { EditoraPipe } from '../../shared/pipes/editora.pipe';
import { AddCitacaoComponent } from './add-citacao/add-citacao.component';
import { CitacoesComponent } from './citacoes/citacoes.component';
import { CapitulosLivroComponent } from './capitulos-livro/capitulos-livro.component';
import { AcompanharProgressoComponent } from './acompanhar-progresso/acompanhar-progresso.component';
import { CapituloStore } from '../../shared/stores/capitulo.store';
import { CapitulosPipe } from '../../shared/pipes/capitulos.pipe';

@Component({
  selector: 'app-livro',
  imports: [
    RouterModule,
    HeaderComponent,
    CommonModule,
    CategoriaPipe,
    GradientePorCategoriaPipe,
    EditoraPipe,
    CapitulosPipe,
    OutrosLivrosComponent,
    AddCitacaoComponent,
    CitacoesComponent,
    CapitulosLivroComponent,
    AcompanharProgressoComponent,
    FormsModule,
  ],
  templateUrl: './livro.component.html',
})
export class LivroComponent {
  #livroStore = inject(LivroStore);
  #autorStore = inject(AutorStore);
  #capituloStore = inject(CapituloStore);

  id = input(0, { transform: numberAttribute });

  livro = computed(() => this.#livroStore.item(this.id()));
  autor = computed(() => this.#autorStore.item(Number(this.livro().autorId)));
  outrosDoAutor = computed(() =>
    this.#livroStore
      .by('autorId', this.livro().autorId)
      .filter((l) => l.id !== this.id())
  );
  outrosDaCategoria = computed(() =>
    this.#livroStore
      .by('categoriaId', this.livro().autorId)
      .filter((l) => l.id !== this.id())
  );

  capitulos = computed(() => this.#capituloStore.by('livroId', this.id()));
  capitulosFinalizados = computed(() =>
    this.#capituloStore.by('livroId', this.id()).filter((c) => c.concluido)
  );

  badgeClasses(status?: string) {
    return {
      'bg-emerald-50 text-emerald-700 border-emerald-200':
        status === EStatus.FINALIZADO,
      'bg-amber-50 text-amber-700 border-amber-200': status === EStatus.LENDO,
      'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200':
        status === EStatus.LER,
    };
  }
  dotClasses(status?: string) {
    return {
      'bg-emerald-600': status === EStatus.FINALIZADO,
      'bg-amber-600': status === EStatus.LENDO,
      'bg-fuchsia-600': status === EStatus.LER,
    };
  }
}
