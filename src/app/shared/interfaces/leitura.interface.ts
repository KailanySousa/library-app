import { EStatus } from '../enums/status.enum';

export interface ILeitura {
  id: number;
  livroId: number;
  inicio: string;
  fim?: string;
  status: EStatus;
}
