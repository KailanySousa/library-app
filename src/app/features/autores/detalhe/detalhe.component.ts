import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalhe-autor',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './detalhe.component.html',
})
export class DetalheAutorComponent implements OnInit {
  autor!: unknown;

  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.setupForm();

    const autorId = this.route.snapshot.paramMap.get('id') as unknown as number;
    if (!autorId) {
      void this.router.navigate(['/autores/lista']);
      return;
    }

    this.updateForm();
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

  updateForm() {
    // this.form.patchValue({
    //   nome: this.categoria.nome,
    //   descricao: this.categoria.descricao ?? '',
    //   cor: this.categoria.cor ?? '#F0ABFC',
    // });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // const body: ICategoria = this.form.getRawValue() as ICategoria;
    // this.service.put(this.categoria.id!, body).subscribe({
    //   next: () => void this.router.navigate(['/categorias/lista']),
    //   error: (e) => console.log('Erro ao editar a categoria', e),
    // });
  }

  remover() {
    if (!this.autor) return;
    // if (confirm('Remover esta categoria? (não remove livros)')) {
    //   this.service.delete(this.categoria.id!).subscribe({
    //     next: () => void this.router.navigate(['/categorias/lista']),
    //     error: (e) => console.log('Erro ao remover a categoria', e),
    //   });
    // }
  }
}
