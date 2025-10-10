import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import ICategoria from '../../../shared/interfaces/categoria.interface';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoriaStore } from '../../../shared/stores/categoria.store';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LivrosPorCategoriaPipe } from '../../../shared/pipes/livros-por-categoria.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-detalhe-categoria',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  providers: [LivrosPorCategoriaPipe],
  templateUrl: './detalhe.component.html',
})
export class DetalheCategoriaComponent {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  #livrosPorCategoriaPipe = inject(LivrosPorCategoriaPipe);
  #formBuilder = inject(FormBuilder);
  #categoriaStore = inject(CategoriaStore);
  #router = inject(Router);

  form: FormGroup = this.#formBuilder.group({
    nome: ['', [this.requiredHelper, Validators.minLength(2)]],
    descricao: [''],
    cor: [
      '#F0ABFC',
      [Validators.pattern(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)],
    ],
  });

  id = input(0, { transform: numberAttribute });
  categoria = computed(() => this.#categoriaStore.item(this.id()));
  qtdLivros = computed(() => this.#livrosPorCategoriaPipe.transform(this.id()));

  readonly syncForm = effect(() => {
    this.form.patchValue({
      nome: this.categoria().nome,
      descricao: this.categoria().descricao ?? '',
      cor: this.categoria().cor ?? '#F0ABFC',
    });
  });

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: ICategoria = this.form.getRawValue() as ICategoria;
    this.#categoriaStore.update(this.categoria().id, body);
    void this.#router.navigate(['/categorias']);
  }

  remover() {
    if (!this.categoria) return;
    if (confirm('Remover esta categoria?')) {
      this.#categoriaStore.remove(this.categoria().id);
      void this.#router.navigate(['/categorias']);
    }
  }
}
