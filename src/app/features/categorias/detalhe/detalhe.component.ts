import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import ICategoria from '../../../shared/interfaces/categoria.interface';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoriaService } from '../../../shared/services/categoria.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LivrosPorCategoriaPipe } from '../../../shared/pipes/livros-por-categoria.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-detalhe-categoria',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  providers: [LivrosPorCategoriaPipe],
  templateUrl: './detalhe.component.html',
})
export class DetalheCategoriaComponent implements OnInit {
  categoria!: ICategoria;

  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  form!: FormGroup;
  qtdLivros: number = 0;

  #livrosPorCategoriaPipe = inject(LivrosPorCategoriaPipe);
  #formBuilder = inject(FormBuilder);
  #service = inject(CategoriaService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);

  ngOnInit() {
    this.setupForm();
    this.buscarDetalhes();
    this.updateForm();
  }

  private buscarDetalhes() {
    const categoriaId = this.#route.snapshot.paramMap.get('id');
    this.categoria = this.#service.getItem(Number.parseInt(categoriaId!));
    this.qtdLivros = this.#livrosPorCategoriaPipe.transform(this.categoria.id);
  }

  private setupForm() {
    this.form = this.#formBuilder.group({
      nome: ['', [this.requiredHelper, Validators.minLength(2)]],
      descricao: [''],
      cor: [
        '#F0ABFC',
        [Validators.pattern(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/)],
      ],
    });
  }

  updateForm() {
    this.form.patchValue({
      nome: this.categoria.nome,
      descricao: this.categoria.descricao ?? '',
      cor: this.categoria.cor ?? '#F0ABFC',
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: ICategoria = {
      ...(this.form.getRawValue() as ICategoria),
      id: this.categoria.id,
    };
    this.#service.put(
      body,
      () => void this.#router.navigate(['/categorias/lista']),
      (e) => console.log('Erro ao editar a categoria', e)
    );
  }

  remover() {
    if (!this.categoria) return;
    if (confirm('Remover esta categoria?')) {
      this.#service.delete(
        this.categoria.id,
        () => void this.#router.navigate(['/categorias/lista']),
        (e) => console.log('Erro ao remover a categoria', e)
      );
    }
  }
}
