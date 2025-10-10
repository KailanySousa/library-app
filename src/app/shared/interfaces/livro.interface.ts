export default interface ILivro {
  id: number;
  ano: string;
  anoFim: string;
  anoInicio: string;
  autorId: string;
  categoriaId: string;
  editoraId: string;
  descricao?: string;
  capitulos?: number;
  status: string;
  titulo: string;
  createdAt: string;
  updatedAt: string;
}
