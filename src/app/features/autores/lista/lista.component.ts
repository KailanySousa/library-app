import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AutorService } from '../../../shared/services/autor.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LivrosPorAutorPipe } from '../../../shared/pipes/livros-por-autor.pipe';

@Component({
  selector: 'app-lista-autores',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, LivrosPorAutorPipe],
  templateUrl: './lista.component.html',
})
export class ListaAutoresComponent {
  #service = inject(AutorService);
  #router = inject(Router);

  readonly autores = this.#service.autores;

  remover(id: number) {
    if (confirm('Remover esta autor? (não remove livros)')) {
      this.#service.delete(
        id,
        () => void this.#router.navigate(['/autores/lista']),
        (e) => console.log('Erro ao remover a autor', e)
      );
    }
  }
}
