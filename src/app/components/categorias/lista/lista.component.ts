import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoriaService } from '../../../categoria.service';
import { CommonModule } from '@angular/common';
import ICategoria from '../../../interfaces/categoria.interface';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './lista.component.html',
})
export class ListaComponent implements OnInit {
  categorias!: ICategoria[];
  constructor(
    private readonly service: CategoriaService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.service.getAll().subscribe((data) => (this.categorias = data));
  }

  remover(id: number) {
    if (confirm('Remover esta categoria? (não remove livros)')) {
      this.service.delete(id).subscribe({
        next: () => void this.router.navigate(['/categorias/lista']),
        error: (e) => console.log('Erro ao remover a categoria', e),
      });
    }
  }
}
