import {
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LivrosPorAutorPipe } from '../../../shared/pipes/livros-por-autor.pipe';
import { AutorStore } from '../../../shared/stores/autor.store';
import IAutor from '../../../shared/interfaces/autor.interface';

@Component({
  selector: 'app-detalhe-autor',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  providers: [LivrosPorAutorPipe],
  templateUrl: './detalhe.component.html',
})
export class DetalheAutorComponent {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  #livrosPorAutorPipe = inject(LivrosPorAutorPipe);
  #formBuilder = inject(FormBuilder);
  #autorStore = inject(AutorStore);
  #router = inject(Router);

  form = this.#formBuilder.group({
    nome: ['', [this.requiredHelper, Validators.minLength(2)]],
    descricao: [''],
  });

  id = input(0, { transform: numberAttribute });
  autor = computed(() => this.#autorStore.item(this.id()));
  qtdLivros = computed(() =>
    this.#livrosPorAutorPipe.transform(this.autor().id)
  );

  private readonly syncForm = effect(() => {
    const a = this.autor();
    if (!a) return;
    this.form.patchValue({
      nome: a.nome,
      descricao: a.descricao ?? '',
    });
  });

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: IAutor = {
      ...(this.form.getRawValue() as IAutor),
    };
    this.#autorStore.update(this.autor().id, body);
    void this.#router.navigate(['/autores/lista']);
  }

  remover() {
    if (!this.autor) return;
    if (confirm('Remover este autor?')) {
      this.#autorStore.remove(this.autor().id);
      void this.#router.navigate(['/autores/lista']);
    }
  }
}
