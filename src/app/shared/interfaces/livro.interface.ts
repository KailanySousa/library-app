export default interface ILivro {
  id: number;
  ano: string;
  autorId: string;
  categoriaId: string;
  editoraId: string;
  descricao?: string;
  status: string;
  titulo: string;
  createdAt: string;
  updatedAt: string;
}
