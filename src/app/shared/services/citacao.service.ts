import { computed, inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ICitacao } from '../interfaces/citacao.interface';

@Injectable({
  providedIn: 'root',
})
export class CitacaoService {
  #storage = inject(LocalStorageService);

  private readonly _citacoes = signal<ICitacao[]>(
    this.#storage.get<ICitacao[]>('citacoes') ?? []
  );

  private readonly proximoId = computed(() => {
    const arr = this._citacoes();
    if (arr.length === 0) return 1;
    const max = arr.reduce((m, l) => (l.id > m ? l.id : m), 0);
    return max + 1;
  });

  getItem(id: number): ICitacao {
    return this._citacoes().find((l) => l.id === id)!;
  }

  setItem(
    texto: string,
    onSucess: (citacaoId: number) => void,
    onError: (e: unknown) => void
  ): void {
    try {
      const data: ICitacao = {
        id: this.proximoId(),
        texto,
      };

      this.#storage.set('citacoes', data, this._citacoes());
      onSucess(data.id);
    } catch (error) {
      onError(error);
    }
  }
}
