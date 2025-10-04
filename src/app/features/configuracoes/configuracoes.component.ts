import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-configuracoes',
  imports: [RouterModule, HeaderComponent],
  templateUrl: './configuracoes.component.html',
})
export class ConfiguracoesComponent {}
