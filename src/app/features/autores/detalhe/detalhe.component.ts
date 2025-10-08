import { Component, inject, OnInit } from '@angular/core';
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
import { LivrosPorAutorPipe } from '../../../shared/pipes/livros-por-autor.pipe';
import { AutorService } from '../../../shared/services/autor.service';
import IAutor from '../../../shared/interfaces/autor.interface';

@Component({
  selector: 'app-detalhe-autor',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  providers: [LivrosPorAutorPipe],
  templateUrl: './detalhe.component.html',
})
export class DetalheAutorComponent implements OnInit {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  form!: FormGroup;

  #livrosPorAutorPipe = inject(LivrosPorAutorPipe);
  #formBuilder = inject(FormBuilder);
  #service = inject(AutorService);
  #router = inject(Router);
  #route = inject(ActivatedRoute);

  autor!: IAutor;
  qtdLivros: number = 0;

  ngOnInit() {
    this.setupForm();
    this.buscarDetalhes();
    this.updateForm();
  }

  private buscarDetalhes() {
    const autorId = this.#route.snapshot.paramMap.get('id');
    this.autor = this.#service.getItem(Number.parseInt(autorId!));
    this.qtdLivros = this.#livrosPorAutorPipe.transform(this.autor.id);
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
      nome: this.autor.nome,
      descricao: this.autor.descricao ?? '',
      cor: this.autor.cor ?? '#F0ABFC',
    });
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: IAutor = {
      ...(this.form.getRawValue() as IAutor),
      id: this.autor.id,
    };
    this.#service.put(
      body,
      () => void this.#router.navigate(['/autores/lista']),
      (e) => console.log('Erro ao editar a categoria', e)
    );
  }

  remover() {
    if (!this.autor) return;
    if (confirm('Remover este autor?')) {
      this.#service.delete(
        this.autor.id,
        () => void this.#router.navigate(['/autores/lista']),
        (e) => console.log('Erro ao remover a categoria', e)
      );
    }
  }
}
