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
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import ILivro from '../../../shared/interfaces/livro.interface';
import { CategoriaStore } from '../../../shared/stores/categoria.store';
import { AutorStore } from '../../../shared/stores/autor.store';
import { LivroStore } from '../../../shared/stores/livro.store';
import { EditoraStore } from '../../../shared/stores/editora.store';

@Component({
  selector: 'app-detalhe-livro',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './detalhe.component.html',
})
export class DetalheLivroComponent {
  readonly currentYear = new Date().getFullYear();

  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  #formBuilder = inject(FormBuilder);
  #livroStore = inject(LivroStore);

  #categoriaStore = inject(CategoriaStore);
  #autorStore = inject(AutorStore);
  #editoraStore = inject(EditoraStore);

  #router = inject(Router);

  readonly form: FormGroup = this.#formBuilder.group({
    titulo: ['', [this.requiredHelper, Validators.minLength(2)]],
    autorId: ['', [this.requiredHelper]],
    ano: [
      '',
      [
        this.requiredHelper,
        Validators.min(1800),
        Validators.max(this.currentYear),
      ],
    ],
    categoriaId: ['', [this.requiredHelper]],
    editoraId: ['', [this.requiredHelper]],
    descricao: [''],
  });

  id = input(0, { transform: numberAttribute });
  livro = computed(() => {
    return this.#livroStore.item(this.id());
  });
  autores = this.#autorStore.autores;
  categorias = this.#categoriaStore.categorias;
  editoras = this.#editoraStore.editoras;

  private readonly syncForm = effect(() => {
    const l = this.livro();
    if (!l) return;
    this.form.patchValue(
      {
        titulo: l.titulo,
        autorId: l.autorId,
        ano: l.ano,
        categoriaId: l.categoriaId,
        editoraId: l.editoraId,
        descricao: l.descricao,
      },
      { emitEvent: false }
    );
  });

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: ILivro = this.form.getRawValue() as ILivro;
    this.#livroStore.update(this.livro().id, body);
    void this.#router.navigate(['/livros']);
  }

  remover() {
    if (!this.livro) return;
    if (confirm('Remover este livro?')) {
      this.#livroStore.remove(this.livro().id);
      void this.#router.navigate(['/livros']);
    }
  }
}
