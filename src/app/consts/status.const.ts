import { EStatus } from '../enums/status.enum';
import IStatus from '../shared/interfaces/status.interface';

export const STATUS_OPTIONS: IStatus[] = Object.values(EStatus).map(
  (status) => ({
    option: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  })
);
