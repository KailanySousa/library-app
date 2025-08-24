import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-autores',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './lista.component.html',
})
export class ListaAutoresComponent {}
