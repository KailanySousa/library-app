export interface ILeitura {
  id: number;
  livroId: number;
  inicio: string;
  fim?: string;
  status: 'pausa' | 'lendo' | 'finalizado';
}
