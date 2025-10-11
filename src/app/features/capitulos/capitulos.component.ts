import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { CapituloStore } from '../../shared/stores/capitulo.store';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterModule } from '@angular/router';
import { ListaVaziaComponent } from '../../shared/components/lista-vazia/lista-vazia.component';
import { AddCapituloComponent } from './add-capitulo/add-capitulo.component';
import { EditCapituloComponent } from './edit-capitulo/edit-capitulo.component';
import { ICapitulo } from '../../shared/interfaces/capitulo.interface';
import { ListaComponent } from './lista/lista.component';

@Component({
  selector: 'app-capitulos',
  imports: [
    CommonModule,
    HeaderComponent,
    RouterModule,
    ListaVaziaComponent,
    AddCapituloComponent,
    EditCapituloComponent,
    ListaComponent,
  ],
  templateUrl: './capitulos.component.html',
})
export class CapitulosComponent {
  #store = inject(CapituloStore);

  livroId = input(0, { transform: numberAttribute });
  capitulos = computed(() => this.#store.by('livroId', this.livroId()));

  formEditarCapituloAberto = signal(false as boolean);
  capituloSelecionado = signal(null as unknown as ICapitulo);

  editar(c: ICapitulo) {
    this.capituloSelecionado.set(c);
    this.formEditarCapituloAberto.set(true);
  }

  fecharForm() {
    this.capituloSelecionado.set(null as unknown as ICapitulo);
    this.formEditarCapituloAberto.set(false);
  }
}
