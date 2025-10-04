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
import { CategoriaService } from '../../../shared/services/categoria.service';
import ICategoria from '../../../shared/interfaces/categoria.interface';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-nova-categoria',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './nova.component.html',
})
export class NovaCategoriaComponent implements OnInit {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: CategoriaService,
    private readonly router: Router
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

    const body: ICategoria = this.form.getRawValue() as ICategoria;

    this.service.post(
      body,
      () => {
        this.form.reset({ cor: '#F0ABFC' });
        void this.router.navigate(['/categorias/lista']);
      },
      (e) => {
        console.log('Erro ao cadastrar a categoria', e);
      }
    );
  }
}
