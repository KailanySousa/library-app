import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { AutorStore } from '../../../shared/stores/autor.store';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-nova-autor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './novo.component.html',
})
export class NovoAutorComponent {
  private readonly requiredHelper = (c: AbstractControl) =>
    Validators.required(c);

  #formBuilder = inject(FormBuilder);
  #autorStore = inject(AutorStore);
  #router = inject(Router);

  form: FormGroup = this.#formBuilder.group({
    nome: ['', [this.requiredHelper, Validators.minLength(2)]],
    descricao: [''],
  });

  salvar(irParaNovoLivro?: boolean) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body: IAutor = this.form.getRawValue() as IAutor;
    if (irParaNovoLivro) {
      const id = this.#autorStore.addWithReturnId(body);
      void this.#router.navigate(['/livros'], {
        queryParams: { autorId: id },
      });
    } else {
      this.#autorStore.add(body);
      void this.#router.navigate(['/autores/lista']);
    }
  }
}
