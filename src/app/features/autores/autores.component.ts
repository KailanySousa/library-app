import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  templateUrl: './autores.component.html',
})
export class AutoresComponent {}
