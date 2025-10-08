import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

interface IAction {
  label: string;
  router: string;
}
interface IItemOpcoes {
  titulo: string;
  descricao: string;
  action?: IAction;
}

interface IOpcoes {
  livros: IItemOpcoes;
  categorias: IItemOpcoes;
  autores: IItemOpcoes;
  lido: IItemOpcoes;
  lendo: IItemOpcoes;
  desejo: IItemOpcoes;
}
const opcoes: IOpcoes = {
  livros: {
    titulo: 'Sua estante está vazia',
    descricao:
      'Você ainda não adicionou nenhum livro por aqui. Comece agora e monte sua própria estante literária.',
    action: {
      label: 'Adicionar primeiro livro',
      router: '/livros/novo',
    },
  },
  categorias: {
    titulo: 'Nenhuma categoria criada ainda',
    descricao:
      'Crie categorias para classificar seus livros — pode ser por gênero, assunto, coleção ou até por humor do momento.',
    action: {
      label: 'Adicionar primeira categoria',
      router: '/categorias/nova',
    },
  },
  autores: {
    titulo: 'Nenhum autor adicionado ainda',
    descricao:
      'Cadastre autores para acompanhar suas obras e descobrir quantos livros você já leu de cada um.',
    action: {
      label: 'Adicionar primeiro autor',
      router: '/autores/novo',
    },
  },
  lido: {
    titulo: 'Ainda nenhum livro lido',
    descricao: 'Conclua sua primeira leitura e veja sua estante ganhar vida!',
  },
  lendo: {
    titulo: 'Nenhuma leitura em andamento',
    descricao: 'Escolha um livro para começar sua próxima jornada.',
  },
  desejo: {
    titulo: 'Lista de desejos vazia',
    descricao: 'Adicione livros que você sonha em ler um dia.',
  },
};

@Component({
  selector: 'app-lista-vazia',
  imports: [RouterModule],
  templateUrl: './lista-vazia.component.html',
})
export class ListaVaziaComponent implements OnInit {
  @Input() public modulo!:
    | 'categorias'
    | 'autores'
    | 'livros'
    | 'lendo'
    | 'lido'
    | 'desejo';
  @Input() public titulo!: string;
  @Input() public descricao!: string;
  @Input() public action: IAction | undefined;

  ngOnInit() {
    this.titulo = opcoes[this.modulo].titulo;
    this.descricao = opcoes[this.modulo].descricao;
    this.action = opcoes[this.modulo].action;
  }
}
