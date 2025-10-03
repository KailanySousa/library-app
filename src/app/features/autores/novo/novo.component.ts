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
import IAutor from '../../../shared/interfaces/autor.interface';
import { AutorService } from '../../../shared/services/autor.service';

@Component({
  selector: 'app-nova-autor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './novo.component.html',
})
export class NovoAutorComponent implements OnInit {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly service: AutorService
  ) {}

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.form = this.fb.group({
      nome: ['', [this.requiredHelper, Validators.minLength(2)]],
      descricao: [''],
      cor: [
        '#F0ABFC',
        [Validators.pattern(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)],
      ],
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: IAutor = this.form.getRawValue() as IAutor;

    this.service.post(
      body,
      () => {
        this.form.reset({ cor: '#F0ABFC' });
        void this.router.navigate(['/autores/lista']);
      },
      (e) => {
        console.log('Erro ao cadastrar o autor', e);
      }
    );
  }
}
