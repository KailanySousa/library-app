import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  constructor(private readonly service: CategoriaService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe((data) => (this.categorias = data));
  }
}
