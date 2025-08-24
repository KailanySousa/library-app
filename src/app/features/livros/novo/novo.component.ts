import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EStatus } from '../../../enums/status.enum';
import { STATUS_OPTIONS } from '../../../consts/status.const';
import { CategoriaService } from '../../../categoria.service';
import ICategoria from '../../../interfaces/categoria.interface';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
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
  form!: FormGroup;
  coverPreview: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly categoriaService: CategoriaService
  ) {}

  ngOnInit() {
    this.setupForm();

    this.categoriaService
      .getAll()
      .subscribe((data) => (this.categorias = data));
  }

  setupForm() {
    this.form = this.fb.group({
      titulo: ['', [this.requiredHelper, Validators.minLength(2)]],
      autor: ['', [this.requiredHelper]],
      ano: [
        '',
        [
          this.requiredHelper,
          Validators.min(1800),
          Validators.max(this.currentYear),
        ],
      ],
      categoria: ['', [this.requiredHelper]],
      status: [EStatus.DESEJO, this.requiredHelper],
      paginas: [null as number | null, [Validators.min(1)]],
      anoInicio: [
        null as string | null,
        [Validators.min(2019), Validators.max(this.currentYear)],
      ],
      anoFim: [null as string | null],
      capaUrl: [''],
      descricao: [''],
    });

    this.form.get('capaUrl')!.valueChanges.subscribe((url) => {
      this.coverPreview = url ? String(url) : null;
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

  async submit() {
    if (this.form.invalid) {
      console.log(this.form.get('anoFim'));
      this.form.markAllAsTouched();
      return;
    }
    await this.router.navigate(['/livros']);
  }
}
