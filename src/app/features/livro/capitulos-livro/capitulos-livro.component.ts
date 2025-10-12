import { Component, computed, inject, input } from '@angular/core';
import { ICapitulo } from '../../../shared/interfaces/capitulo.interface';
import { RouterModule } from '@angular/router';
import { CapituloStore } from '../../../shared/stores/capitulo.store';
import { LeituraStore } from '../../../shared/stores/leitura.store';

@Component({
  selector: 'app-capitulos-livro',
  imports: [RouterModule],
  templateUrl: './capitulos-livro.component.html',
})
export class CapitulosLivroComponent {
  livroId = input.required<number>();
  capitulos = input.required<ICapitulo[]>();

  #store = inject(CapituloStore);
  #leituraStore = inject(LeituraStore);

  leituraFinalizada = computed(() => {
    const leitura = this.#leituraStore.item(this.livroId());
    return leitura && leitura.status === 'finalizado';
  });

  qtdCapitulos = computed(
    () => this.capitulos().filter((c) => c.concluido).length
  );

  marcar(capitulo: ICapitulo) {
    if (this.leituraFinalizada()) return;
    this.#store.update(capitulo.id, { concluido: !capitulo.concluido });
  }
}
