import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CategoriaService } from '../../../shared/services/categoria.service';
import { CommonModule } from '@angular/common';
import ICategoria from '../../../shared/interfaces/categoria.interface';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { LivrosPorCategoriaPipe } from '../../../shared/pipes/livros-por-categoria.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HeaderComponent,
    LivrosPorCategoriaPipe,
  ],
  templateUrl: './lista.component.html',
})
export class ListaCategoriasComponent implements OnInit {
  categorias!: ICategoria[];
  constructor(
    private readonly service: CategoriaService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.categorias = this.service.getAll();
  }

  remover(id: number) {
    if (confirm('Remover esta categoria?')) {
      this.service.delete(
        id,
        () => void this.router.navigate(['/categorias/lista']),
        (e) => console.log('Erro ao remover a categoria', e)
      );
    }
  }
}
