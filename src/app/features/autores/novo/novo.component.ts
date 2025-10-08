import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { seedHex } from '../../../shared/utils/color.util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-nova-autor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './novo.component.html',
})
export class NovoAutorComponent implements OnInit {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  form!: FormGroup;

  #formBuilder = inject(FormBuilder);
  #service = inject(AutorService);
  #router = inject(Router);

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.form = this.#formBuilder.group({
      nome: ['', [this.requiredHelper, Validators.minLength(2)]],
      descricao: [''],
      cor: [
        seedHex('', { s: 72, l: 50 }),
        [
          this.requiredHelper,
          Validators.pattern(/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/),
        ],
      ],
    });
  }

  aplicarCor() {
    const nome = this.form.get('nome')!.value as string;
    const corCtrl = this.form.get('cor')!;
    corCtrl.patchValue(seedHex(nome, { s: 72, l: 50 }), {
      emitEvent: false,
    });
  }

  salvar(irParaNovoLivro?: boolean) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: IAutor = this.form.getRawValue() as IAutor;

    this.#service.post(
      body,
      (id: number) => {
        this.form.reset({ cor: '#F0ABFC' });
        if (irParaNovoLivro) {
          void this.#router.navigate(['/livros/novo'], {
            queryParams: { categoriaId: id },
          });
        } else {
          void this.#router.navigate(['/autores/lista']);
        }
      },
      (e) => {
        console.log('Erro ao cadastrar o autor', e);
      }
    );
  }
}
