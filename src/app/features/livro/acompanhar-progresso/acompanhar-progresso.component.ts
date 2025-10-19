import { Component, computed, inject, input } from '@angular/core';
import { LeituraStore } from '../../../shared/stores/leitura.store';
import { ILeitura } from '../../../shared/interfaces/leitura.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-acompanhar-progresso',
  imports: [RouterModule],
  templateUrl: './acompanhar-progresso.component.html',
})
export class AcompanharProgressoComponent {
  livroId = input.required<number>();
  #leituraStore = inject(LeituraStore);

  leituraFinalizada = computed(() => {
    const leitura = this.#leituraStore.itemBy('livroId', this.livroId());

    return leitura && leitura.status === 'finalizado';
  });

  leituraPausada = computed(() => {
    const leitura = this.#leituraStore.itemBy('livroId', this.livroId());

    return leitura && leitura.status === 'pausa';
  });

  leituraIniciada = computed(() => {
    const leitura = this.#leituraStore.itemBy('livroId', this.livroId());

    return leitura && leitura.status === 'lendo';
  });

  ler = computed(() => {
    return (
      !this.leituraIniciada() &&
      !this.leituraPausada() &&
      !this.leituraFinalizada()
    );
  });
  iniciarLeitura() {
    const leitura = this.#leituraStore.itemBy('livroId', this.livroId());
    const livro = {
      livroId: this.livroId(),
      status: 'lendo',
    };
    if (leitura) {
      this.#leituraStore.update(leitura.id, livro as Partial<ILeitura>);
    } else {
      this.#leituraStore.add(livro as Omit<ILeitura, 'id' | 'inicio'>);
    }
  }
  pausarLeitura() {
    const leitura = this.#leituraStore.itemBy('livroId', this.livroId());
    const livro = {
      livroId: this.livroId(),
      status: 'pausa',
    };
    if (leitura) {
      this.#leituraStore.update(leitura.id, livro as Partial<ILeitura>);
    } else {
      this.#leituraStore.add(livro as Omit<ILeitura, 'id' | 'inicio'>);
    }
  }

  finalizarLeitura() {
    const leitura = this.#leituraStore.itemBy('livroId', this.livroId());
    const livro = {
      livroId: this.livroId(),
      status: 'finalizado',
    };
    if (leitura) {
      this.#leituraStore.update(leitura.id, livro as Partial<ILeitura>);
    } else {
      this.#leituraStore.add(livro as Omit<ILeitura, 'id' | 'inicio'>);
    }
  }
}
