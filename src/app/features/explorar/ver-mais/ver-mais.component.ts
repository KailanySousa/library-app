import { Component, effect, inject, input } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CardLivroComponent } from '../card-livro/card-livro.component';
import { ListaVaziaComponent } from '../../../shared/components/lista-vazia/lista-vazia.component';
import { EStatus } from '../../../shared/enums/status.enum';
import ILivro from '../../../shared/interfaces/livro.interface';
import { LivroStore } from '../../../shared/stores/livro.store';

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
export class VerMaisComponent {
  readonly EStatus = EStatus;
  #livroStore = inject(LivroStore);

  status = input('');
  livros!: ILivro[];
  textos!: ITextos;

  setData = effect(() => {
    this.livros = this.#livroStore.by('status', this.status());
    this.textos = textos[this.status() as keyof IConteudo];
  });
}
