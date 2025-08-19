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
import { EStatus } from '../../enums/status.enum';
import { STATUS_OPTIONS } from '../../consts/status.const';

@Component({
  selector: 'app-novo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './novo.component.html',
})
export class NovoComponent implements OnInit {
  // TODO: listar categorias
  // TODO: alterar hint para anoFim >= anoInicio

  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  readonly statusOptions = STATUS_OPTIONS;
  form!: FormGroup;
  coverPreview: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    const currentYear = new Date().getFullYear();

    this.form = this.fb.group({
      titulo: ['', [this.requiredHelper, Validators.minLength(2)]],
      autor: ['', [this.requiredHelper]],
      ano: [
        '',
        [
          this.requiredHelper,
          Validators.min(1800),
          Validators.max(currentYear),
        ],
      ],
      categoria: ['', [this.requiredHelper]],
      status: [EStatus.DESEJO, this.requiredHelper],
      paginas: [null as number | null, [Validators.min(1)]],
      anoInicio: [null as string | null, [Validators.min(2019)]],
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
      anoInicioControl?.setValidators(this.requiredHelper);
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
      this.form.markAllAsTouched();
      return;
    }
    await this.router.navigate(['/livros']);
  }
}
