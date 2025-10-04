import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { CategoriaService } from '../../../shared/services/categoria.service';
import ICategoria from '../../../shared/interfaces/categoria.interface';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AutorService } from '../../../shared/services/autor.service';
import IAutor from '../../../shared/interfaces/autor.interface';
import ILivro from '../../../shared/interfaces/livro.interface';
import { LivroService } from '../../../shared/services/livro.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-novo-livro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './novo.component.html',
})
export class NovoLivroComponent implements OnInit {
  readonly currentYear = new Date().getFullYear();

  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  readonly statusOptions = STATUS_OPTIONS;
  categorias!: ICategoria[];
  autores!: IAutor[];
  form!: FormGroup;
  coverPreview: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly categoriaService: CategoriaService,
    private readonly autorService: AutorService,
    private readonly service: LivroService
  ) {}

  ngOnInit() {
    this.setupForm();

    this.categorias = this.categoriaService.getAll();
    this.autores = this.autorService.getAll();
  }

  setupForm() {
    this.form = this.fb.group({
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

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: ILivro = this.form.getRawValue() as ILivro;
    this.service.post(
      body,
      () => {
        this.form.reset({ cor: '#F0ABFC' });
        void this.router.navigate(['/livros/lista']);
      },
      (e) => {
        console.log('Erro ao cadastrar o livro', e);
      }
    );
  }
}
