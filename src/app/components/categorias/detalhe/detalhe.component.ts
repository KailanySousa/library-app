import { Component, OnInit } from '@angular/core';
import ICategoria from '../../../interfaces/categoria.interface';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoriaService } from '../../../categoria.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalhe',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './detalhe.component.html',
})
export class DetalheComponent implements OnInit {
  categoria!: ICategoria;

  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: CategoriaService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.setupForm();

    const categoria = this.route.snapshot.paramMap.get('id');
    if (!categoria) {
      void this.router.navigate(['/categorias']);
      return;
    }

    //this.updateForm(categoria);
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

  updateForm(categoria: ICategoria) {
    this.form.patchValue({
      nome: categoria.nome,
      descricao: categoria.descricao ?? '',
      cor: categoria.cor ?? '#F0ABFC',
    });
  }

  salvar() {}

  remover() {
    if (!this.categoria) return;
    if (confirm('Remover esta categoria? (não remove livros)')) {
      // service
      void this.router.navigate(['/categorias/listar']);
    }
  }
}
