import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import IAutor from '../../../shared/interfaces/autor.interface';
import { AutorService } from '../../../shared/services/autor.service';

@Component({
  selector: 'app-lista-autores',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './lista.component.html',
})
export class ListaAutoresComponent implements OnInit {
  autores!: IAutor[];
  constructor(
    private readonly service: AutorService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.autores = this.service.getAll();
  }

  remover(id: number) {
    if (confirm('Remover esta autor? (não remove livros)')) {
      this.service.delete(
        id,
        () => void this.router.navigate(['/autores/lista']),
        (e) => console.log('Erro ao remover a autor', e)
      );
    }
  }
}
