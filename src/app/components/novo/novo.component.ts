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

@Component({
  selector: 'app-novo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './novo.component.html',
})
export class NovoComponent implements OnInit {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  form!: FormGroup;
  coverPreview: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      titulo: ['', [this.requiredHelper, Validators.minLength(2)]],
      autor: ['', [this.requiredHelper]],
      categoria: ['', [this.requiredHelper]],
      status: ['desejo', this.requiredHelper], // 'lido' | 'lendo' | 'desejo' | 'faltando'
      paginas: [null as number | null, [Validators.min(1)]],
      anoInicio: [null as string | null],
      anoFim: [null as string | null],
      capaUrl: ['', [this.requiredHelper]],
      descricao: [''],
    });

    this.form.get('capaUrl')!.valueChanges.subscribe((url) => {
      this.coverPreview = url ? String(url) : null;
    });
  }

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    await this.router.navigate(['/livros']);
  }
}
