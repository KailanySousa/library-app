import { Component, computed, inject, input, output } from '@angular/core';
import { ICapitulo } from '../../../shared/interfaces/capitulo.interface';
import { CommonModule } from '@angular/common';
import { CapituloStore } from '../../../shared/stores/capitulo.store';
import { LeituraStore } from '../../../shared/stores/leitura.store';

@Component({
  selector: 'app-lista',
  imports: [CommonModule],
  templateUrl: './lista.component.html',
})
export class ListaComponent {
  livroId = input.required<number>();
  capitulos = input.required<ICapitulo[]>();
  editarCapitulo = output<ICapitulo>();

  #store = inject(CapituloStore);
  #leituraStore = inject(LeituraStore);

  leituraFinalizada = computed(() => {
    const leitura = this.#leituraStore.item(this.livroId());
    return leitura && leitura.status === 'finalizado';
  });

  editar(c: ICapitulo) {
    this.editarCapitulo.emit(c);
  }

  excluir(id: number) {
    this.#store.remove(id);
  }

  marcar(capitulo: ICapitulo) {
    if (this.leituraFinalizada()) return;
    this.#store.update(capitulo.id, { concluido: !capitulo.concluido });
  }
}
