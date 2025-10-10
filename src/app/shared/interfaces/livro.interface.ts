export default interface ILivro {
  id: number;
  ano: string;
  anoFim: string;
  anoInicio: string;
  autorId: string;
  categoriaId: string;
  descricao?: string;
  capitulos?: number;
  editora?: string;
  status: string;
  titulo: string;
  createdAt: string;
  updatedAt: string;
}
