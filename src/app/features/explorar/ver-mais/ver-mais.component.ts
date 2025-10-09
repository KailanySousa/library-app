import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CardLivroComponent } from '../card-livro/card-livro.component';
import { ListaVaziaComponent } from '../../../shared/components/lista-vazia/lista-vazia.component';
import { EStatus } from '../../../shared/enums/status.enum';
import { LivroService } from '../../../shared/services/livro.service';
import ILivro from '../../../shared/interfaces/livro.interface';
import { ActivatedRoute } from '@angular/router';

interface ITextos {
  titulo: string;
  descricao: string;
}

interface IConteudo {
  [EStatus.DESEJO]: ITextos;
  [EStatus.LIDO]: ITextos;
  [EStatus.LENDO]: ITextos;
}

const textos: IConteudo = {
  [EStatus.DESEJO]: {
    titulo: 'Lista de desejos',
    descricao:
      'Títulos que sussurram o meu nome — prontos para a próxima aventura.',
  },
  [EStatus.LIDO]: {
    titulo: 'Já lidos',
    descricao:
      'Leituras concluídas recentemente — o que ficou na memória (e no coração).',
  },
  [EStatus.LENDO]: {
    titulo: 'Leitura em andamento',
    descricao: 'Já lidos, mas ainda não chegaram na prateleira física.',
  },
};

@Component({
  selector: 'app-ver-mais',
  imports: [HeaderComponent, CardLivroComponent, ListaVaziaComponent],
  templateUrl: './ver-mais.component.html',
})
export class VerMaisComponent implements OnInit {
  readonly EStatus = EStatus;
  textos!: ITextos;
  #service = inject(LivroService);
  #route = inject(ActivatedRoute);

  livros!: ILivro[];
  ngOnInit() {
    const q = this.#route.snapshot.queryParams['status'] as string;
    this.livros = this.#service.by('status', q)();
    this.textos = textos[q as keyof IConteudo];
  }
}
