import { Component, inject, input } from '@angular/core';
import {
  AbstractControl,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ICapitulo } from '../../../shared/interfaces/capitulo.interface';
import { CapituloStore } from '../../../shared/stores/capitulo.store';

@Component({
  selector: 'app-add-capitulo',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-capitulo.component.html',
})
export class AddCapituloComponent {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  livroId = input.required<number>();
  #store = inject(CapituloStore);

  #formBuilder = inject(FormBuilder);

  formAdicionar = this.#formBuilder.group({
    nome: ['', this.requiredHelper],
    concluido: [false, this.requiredHelper],
  });

  adicionar() {
    const body = {
      ...this.formAdicionar.getRawValue(),
      livroId: this.livroId(),
    } as ICapitulo;
    this.#store.add(body);
    this.formAdicionar.reset();
  }

  resetForm() {
    this.formAdicionar.reset();
  }
}
