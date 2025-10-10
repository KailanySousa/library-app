import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EStatus } from '../../../shared/enums/status.enum';
import { STATUS_OPTIONS } from '../../../shared/consts/status.const';
import { CategoriaStore } from '../../../shared/stores/categoria.store';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AutorStore } from '../../../shared/stores/autor.store';
import ILivro from '../../../shared/interfaces/livro.interface';
import { LivroStore } from '../../../shared/stores/livro.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { EditoraStore } from '../../../shared/stores/editora.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-novo-livro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './novo.component.html',
})
export class NovoLivroComponent {
  #livroStore = inject(LivroStore);
  #autorStore = inject(AutorStore);
  #categoriaStore = inject(CategoriaStore);
  #editoraStore = inject(EditoraStore);

  #formBuilder = inject(FormBuilder);
  #router = inject(Router);
  readonly currentYear = new Date().getFullYear();

  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  readonly statusOptions = STATUS_OPTIONS;
  categorias = this.#categoriaStore.categorias;
  autores = this.#autorStore.autores;
  editoras = this.#editoraStore.editoras;
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
    status: [EStatus.DESEJO, this.requiredHelper],
    descricao: [''],
  });

  private readonly statusValue: Signal<EStatus> = toSignal(
    this.form.get('status')!.valueChanges,
    { initialValue: this.form.get('status')!.value as EStatus }
  );

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: ILivro = this.form.getRawValue() as ILivro;
    this.#livroStore.add(body);
    void this.#router.navigate(['/livros']);
  }
}
