import {
  Component,
  computed,
  //computed,
  inject,
  input,
} from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CardLivroComponent } from '../card-livro/card-livro.component';
import { ListaVaziaComponent } from '../../../shared/components/lista-vazia/lista-vazia.component';
import { EStatus } from '../../../shared/enums/status.enum';
import { LivroStore } from '../../../shared/stores/livro.store';
import { LeituraStore } from '../../../shared/stores/leitura.store';

interface ITextos {
  titulo: string;
  descricao: string;
}

interface IConteudo {
  [EStatus.LER]: ITextos;
  [EStatus.FINALIZADO]: ITextos;
  [EStatus.LENDO]: ITextos;
}

const textos: IConteudo = {
  [EStatus.LER]: {
    titulo: 'Lista de desejos',
    descricao:
      'Títulos que sussurram o meu nome — prontos para a próxima aventura.',
  },
  [EStatus.FINALIZADO]: {
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
  #leituraStore = inject(LeituraStore);

  status = input(EStatus.FINALIZADO);
  textos = computed(() => textos[this.status() as keyof IConteudo]);
  livros = computed(() => {
    const leituras = this.#leituraStore
      .by('status', this.status())
      .flatMap((l) => (l.status === this.status() ? l.livroId : null))
      .filter((l) => l !== null);
    console.log('🚀 ~ VerMaisComponent ~ leituras:', leituras);

    return this.#livroStore.allBy(leituras);
  });
}
