import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
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
  selector: 'app-detalhe-editora',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './detalhe.component.html',
})
export class DetalheEditoraComponent {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  #formBuilder = inject(FormBuilder);
  #router = inject(Router);
  #store = inject(EditoraStore);

  id = input(0, { transform: numberAttribute });
  editora = computed(() => this.#store.item(this.id()));

  form = this.#formBuilder.group({
    nome: ['', [this.requiredHelper, Validators.minLength(2)]],
  });

  qtdLivros = signal<number>(0);

  readonly syncForm = effect(() => {
    const e = this.editora();
    if (e) {
      this.form.patchValue({ nome: e.nome });
    }
  });

  salvar() {
    if (this.form.invalid || !this.editora()) {
      this.form.markAllAsTouched();
      return;
    }

    const body = this.form.getRawValue() as IEditora;
    this.#store.update(this.id(), body);
  }

  remover() {
    this.#store.remove(this.id());
    void this.#router.navigate(['/editoras']);
  }
}
