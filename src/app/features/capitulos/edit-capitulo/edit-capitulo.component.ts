import { Component, effect, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CapituloStore } from '../../../shared/stores/capitulo.store';
import { ICapitulo } from '../../../shared/interfaces/capitulo.interface';

@Component({
  selector: 'app-edit-capitulo',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit-capitulo.component.html',
})
export class EditCapituloComponent {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  capitulo = input.required<ICapitulo>();
  fecharForm = output();
  #store = inject(CapituloStore);
  #formBuilder = inject(FormBuilder);

  formRenomear = this.#formBuilder.group({
    nome: ['', this.requiredHelper],
  });

  readonly syncForm = effect(() => {
    const { nome } = this.capitulo();
    this.formRenomear.patchValue({ nome });
  });

  renomear() {
    this.#store.update(
      this.capitulo().id,
      this.formRenomear.getRawValue() as ICapitulo
    );
    this.formRenomear.reset();
    this.fecharForm.emit();
  }

  cancelar() {
    this.formRenomear.reset();
    this.fecharForm.emit();
  }
}
