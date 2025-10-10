import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { EditoraStore } from '../../../shared/stores/editora.store';
import IEditora from '../../../shared/interfaces/editora.interface';

@Component({
  selector: 'app-nova-editora',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './nova.component.html',
})
export class NovaEditoraComponent {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  #formBuilder = inject(FormBuilder);
  #router = inject(Router);
  #store = inject(EditoraStore);

  form = this.#formBuilder.group({
    nome: ['', [this.requiredHelper, Validators.minLength(2)]],
  });

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const body = this.form.getRawValue() as IEditora;
    this.#store.add(body);
    void this.#router.navigate(['/editoras']);
  }
}
