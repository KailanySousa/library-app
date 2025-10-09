import { computed, inject, Injectable, signal } from '@angular/core';
import { ICitacoesPorLivro } from '../interfaces/citacoes-por-livro';
import { LocalStorageService } from './local-storage.service';
import { CitacaoService } from './citacao.service';
import { ICitacao } from '../interfaces/citacao.interface';

@Injectable({
  providedIn: 'root',
})
export class CitacoesPorLivroService {
  #storage = inject(LocalStorageService);
  #citacaoService = inject(CitacaoService);

  private readonly _citacoes = signal<ICitacoesPorLivro[]>(
    this.#storage.get<ICitacoesPorLivro[]>('citacoes_livro') ?? []
  );

  private readonly proximoId = computed(() => {
    const arr = this._citacoes();
    if (arr.length === 0) return 1;
    const max = arr.reduce((m, l) => (l.id > m ? l.id : m), 0);
    return max + 1;
  });

  setItem(
    livroId: number,
    texto: string,
    onSucess: (citacoes: ICitacao[]) => void,
    onError: (e?: unknown) => void
  ): void {
    try {
      this.#citacaoService.setItem(
        texto,
        (citacaoId) => {
          const data: ICitacoesPorLivro = {
            id: this.proximoId(),
            livroId,
            citacaoId,
          };
          this.#storage.set('citacoes_livro', data, this._citacoes());
          onSucess(this.getCitacoesPorLivro(livroId));
        },
        (error) => onError(error)
      );
    } catch (error) {
      onError(error);
    }
  }

  getCitacoesPorLivro(livroId: number): ICitacao[] {
    console.log(this._citacoes());
    const citacoes = this._citacoes().filter((c) => c.livroId == livroId);

    const citacoesLivro: ICitacao[] = [];

    citacoes.forEach((c) => {
      citacoesLivro.push(this.#citacaoService.getItem(c.citacaoId));
    });

    return citacoesLivro;
  }
}
