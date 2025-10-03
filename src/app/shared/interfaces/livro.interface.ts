export default interface ILivro {
  id: number;
  ano: string;
  anoFim: string;
  anoInicio: string;
  autorId: number;
  categoriaId: number;
  descricao?: string;
  paginas?: number;
  status: string;
  titulo: string;
}
