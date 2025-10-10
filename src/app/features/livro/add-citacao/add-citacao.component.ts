import { Component, inject, input, signal } from '@angular/core';
import { CitacaoLivroStore } from '../../../shared/stores/citacao-livro.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-citacao',
  templateUrl: './add-citacao.component.html',
  imports: [FormsModule],
})
export class AddCitacaoComponent {
  livroId = input.required<number>();
  #citacaoLivroStore = inject(CitacaoLivroStore);

  formCitacaoAberto = signal(false as boolean);
  citacaoTexto = '';

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

    if (!this.livroId()) return;

    this.#citacaoLivroStore.add(this.livroId(), texto);
    this.cancelarCitacao();
  }
}
