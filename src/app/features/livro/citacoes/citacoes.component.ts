import { Component, computed, inject, input } from '@angular/core';
import { CitacaoLivroStore } from '../../../shared/stores/citacao-livro.store';

@Component({
  selector: 'app-citacoes',
  templateUrl: './citacoes.component.html',
})
export class CitacoesComponent {
  livroId = input.required<number>();
  #citacaoLivroStore = inject(CitacaoLivroStore);

  citacoes = computed(() =>
    this.#citacaoLivroStore.citacoesPorLivro(this.livroId())
  );
}
