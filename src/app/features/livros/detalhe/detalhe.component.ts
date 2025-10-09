import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { EStatus } from '../../../shared/enums/status.enum';
import ILivro from '../../../shared/interfaces/livro.interface';
import { STATUS_OPTIONS } from '../../../shared/consts/status.const';
import ICategoria from '../../../shared/interfaces/categoria.interface';
import IAutor from '../../../shared/interfaces/autor.interface';
import { CategoriaService } from '../../../shared/services/categoria.service';
import { AutorService } from '../../../shared/services/autor.service';
import { LivroStore } from '../../../shared/stores/livro.store';

@Component({
  selector: 'app-detalhe-livro',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './detalhe.component.html',
})
export class DetalheLivroComponent implements OnInit {
  readonly currentYear = new Date().getFullYear();

  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);
  readonly statusOptions = STATUS_OPTIONS;
  categorias!: ICategoria[];
  autores!: IAutor[];
  form!: FormGroup;

  #formBuilder = inject(FormBuilder);
  #livroStore = inject(LivroStore);

  #categoriaService = inject(CategoriaService);
  #autorService = inject(AutorService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);

  livroId = input(0, { transform: numberAttribute });
  livro = computed(() => this.#livroStore.getItem(this.livroId()));

  ngOnInit() {
    this.categorias = this.#categoriaService.getAll();
    this.autores = this.#autorService.getAll();
    this.setupForm();
    this.updateForm();
  }

  setupForm() {
    this.form = this.#formBuilder.group({
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
      status: [EStatus.DESEJO, this.requiredHelper],
      paginas: [null as number | null, [Validators.min(1)]],
      anoInicio: [
        null as string | null,
        [Validators.min(2019), Validators.max(this.currentYear)],
      ],
      anoFim: [null as string | null],
      descricao: [''],
    });
  }

  updateForm() {
    this.form.patchValue({
      titulo: this.livro().titulo,
      autorId: this.livro().autorId,
      ano: this.livro().ano,
      categoriaId: this.livro().categoriaId,
      status: this.livro().status,
      paginas: this.livro().paginas,
      anoInicio: this.livro().anoInicio,
      anoFim: this.livro().anoFim,
      descricao: this.livro().descricao,
    });
  }

  onChangeStatus() {
    const status: EStatus = this.form.get('status')?.value as EStatus;

    this.verifyAnoInicioRequired(status);
    this.verifyAnoFimRequired(status);
  }

  verifyAnoInicioRequired(status: EStatus) {
    const anoInicioControl = this.form.get('anoInicio');
    if (status !== EStatus.DESEJO) {
      anoInicioControl?.setValidators([
        this.requiredHelper,
        Validators.min(2019),
      ]);
    } else {
      anoInicioControl?.removeValidators(this.requiredHelper);
      anoInicioControl?.markAsTouched();
    }
    anoInicioControl?.setValue(null);
  }

  verifyAnoFimRequired(status: EStatus) {
    const anoFimControl = this.form.get('anoFim');
    if (status !== EStatus.DESEJO && status !== EStatus.LENDO) {
      const anoInicioValue = this.form.get('anoInicio')?.value as number;
      anoFimControl?.setValidators([
        this.requiredHelper,
        Validators.min(anoInicioValue),
      ]);
    } else {
      anoFimControl?.removeValidators(this.requiredHelper);
      anoFimControl?.markAsTouched();
    }
    anoFimControl?.setValue(null);
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: ILivro = this.form.getRawValue() as ILivro;
    this.#livroStore.update(this.livro().id, body);
  }

  remover() {
    if (!this.livro) return;
    if (confirm('Remover este livro?')) {
      this.#livroStore.remove(this.livro().id);
    }
  }
}
