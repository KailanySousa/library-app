import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import ILivro from '../../../shared/interfaces/livro.interface';
import { LivroService } from '../../../shared/services/livro.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AutorPipe } from '../../../shared/pipes/autor.pipe';
import { CategoriaPipe } from '../../../shared/pipes/categoria.pipe';

@Component({
  selector: 'app-lista-livros',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HeaderComponent,
    AutorPipe,
    CategoriaPipe,
  ],
  templateUrl: './lista.component.html',
})
export class ListaLivrosComponent implements OnInit {
  #service = inject(LivroService);
  #router = inject(Router);
  livros!: ILivro[];

  ngOnInit(): void {
    this.livros = this.#service.getAll();
  }

  remover(id: number) {
    if (confirm('Remover esta categoria? (não remove livros)')) {
      this.#service.delete(
        id,
        () => void this.#router.navigate(['/livros/lista']),
        (e) => console.log('Erro ao remover a categoria', e)
      );
    }
  }
}
