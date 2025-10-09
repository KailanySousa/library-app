import { Pipe, PipeTransform } from '@angular/core';
import { EStatus } from '../enums/status.enum';

@Pipe({
  name: 'statusHeader',
})
export class StatusHeaderPipe implements PipeTransform {
  transform(status?: string): string {
    if (status === EStatus.LIDO) return 'Já lidos';
    if (status == EStatus.LENDO) return 'Leituras em andamento';
    if (status == EStatus.DESEJO) return 'Lista de desejos';
    return '';
  }
}

@Pipe({
  name: 'status',
})
export class StatusPipe implements PipeTransform {
  transform(status?: string): string {
    if (status === EStatus.LIDO) return 'Lido';
    if (status === EStatus.LENDO) return 'Lendo';
    if (status === EStatus.DESEJO) return 'Desejo';
    return '—';
  }
}
