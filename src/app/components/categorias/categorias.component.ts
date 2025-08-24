import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent {}
