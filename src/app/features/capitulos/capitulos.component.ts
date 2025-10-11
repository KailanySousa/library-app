import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapituloStore } from '../../shared/stores/capitulo.store';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterModule } from '@angular/router';
import { ListaVaziaComponent } from '../../shared/components/lista-vazia/lista-vazia.component';
import { AddCapituloComponent } from './add-capitulo/add-capitulo.component';

@Component({
  selector: 'app-capitulos',
  imports: [
    FormsModule,
    CommonModule,
    HeaderComponent,
    RouterModule,
    ListaVaziaComponent,
    AddCapituloComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './capitulos.component.html',
})
export class CapitulosComponent {
  #store = inject(CapituloStore);

  livroId = input(0, { transform: numberAttribute });
  capitulos = computed(() => this.#store.by('livroId', this.livroId()));
}
