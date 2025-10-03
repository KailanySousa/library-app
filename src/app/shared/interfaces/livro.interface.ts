export default interface ILivro {
  id: number;
  ano: string;
  anoFim: number;
  anoInicio: number;
  autor: string;
  categoria: string;
  descricao?: string;
  paginas?: number;
  status: string;
  titulo: string;
}
