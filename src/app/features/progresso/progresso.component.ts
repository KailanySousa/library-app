import {
  Component,
  computed,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ICapitulo } from '../../shared/interfaces/capitulo.interface';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LivroStore } from '../../shared/stores/livro.store';
import { LeituraStore } from '../../shared/stores/leitura.store';
import { CapituloStore } from '../../shared/stores/capitulo.store';

type Filtro = 'todos' | 'lidos' | 'restantes';

@Component({
  standalone: true,
  selector: 'app-progresso',
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './progresso.component.html',
})
export class ProgressoComponent {
  #livroStore = inject(LivroStore);
  #leituraStore = inject(LeituraStore);
  #capituloStore = inject(CapituloStore);

  id = input(0, { transform: numberAttribute });
  livro = computed(() => this.#livroStore.item(this.id()));
  leitura = computed(() => this.#leituraStore.itemBy('livroId', this.id()));
  capitulos = computed(() => this.#capituloStore.itemBy('livroId', this.id()));

  total = computed(() => this.capitulos().length);
  lidosQtd = computed(
    () => this.capitulos().filter((c) => !!c.concluido).length
  );
  percent = computed(() => {
    const t = this.total();
    return t ? Math.round((this.lidosQtd() / t) * 100) : 0;
  });

  // (4) Filtros rápidos
  filtro = signal<Filtro>('todos');
  capitulosFiltrados = computed(() => {
    const lista = this.capitulos();
    switch (this.filtro()) {
      case 'lidos':
        return lista.filter((c) => !!c.concluido);
      case 'restantes':
        return lista.filter((c) => !c.concluido);
      default:
        return lista;
    }
  });

  hojeISO = computed(() =>
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10)
  );
  comecouHoje = computed(() => this.leitura()?.inicio === this.hojeISO());
  metadeOuMais = computed(() => this.percent() >= 50 && this.percent() < 100);
  concluidoSemanaAtual = computed(() => {
    const fim = this.leitura()?.fim;
    if (!fim) return false;
    const d = new Date(fim);
    if (isNaN(d.getTime())) return false;
    const { iniSemana, fimSemana } = this.intervaloSemanaAtual();
    return d >= iniSemana && d < fimSemana;
  });

  // UX / Proteções (10)
  editandoDatas = signal(false);
  dataErro = signal<string | null>(null);
  toast = signal<string | null>(null);

  // ===== AÇÕES PRINCIPAIS =====

  toggleCapitulo(capituloId: number) {
    const next = this.capitulos().find((c) => c.id === capituloId);

    this.#capituloStore.update(capituloId, {
      ...next,
      concluido: !next?.concluido,
    });
    this.feedback('Progresso atualizado.');
  }

  // (3) Marcar até aqui (com base na posição original no array completo)
  marcarAtePorId(capituloId: number) {
    const idx = this.capitulos().findIndex((c) => c.id === capituloId);
    if (idx < 0) return;
    const next = this.capitulos().map((c, i) => ({
      ...c,
      concluido: i <= idx,
    }));
    
    next.forEach((c) => this.#capituloStore.update(c.id, c));
    this.feedback(`Marcado até o capítulo ${idx + 1}.`);
    // TODO: persistir em lote
  }

  marcarTodos() {
    if (this.total() === 0 || this.lidosQtd() === this.total()) return;
    this.capitulos().forEach((c) =>
      this.#capituloStore.update(c.id, { ...c, concluido: true })
    );
    this.feedback('Todos os capítulos marcados como lidos.');
    // TODO: persistir em lote
  }

  limparTudo() {
    if (this.lidosQtd() === 0) return;
    const confirmar = window.confirm(
      'Tem certeza que deseja limpar todo o progresso?'
    );
    if (!confirmar) return;
    this.capitulos().forEach((c) =>
      this.#capituloStore.update(c.id, { ...c, concluido: false })
    );
    this.feedback('Progresso limpo.');
  }

  // ===== DATAS (edição simples) =====

  toggleEditarDatas() {
    this.editandoDatas.update((v) => !v);
    this.dataErro.set(null);
  }

  salvarDatas(inicio: string, fim: string) {
    this.dataErro.set(null);
    const inicioVal = inicio?.trim() || undefined;
    const fimVal = fim?.trim() || undefined;

    if (inicioVal && fimVal) {
      const dIni = new Date(inicioVal);
      const dFim = new Date(fimVal);
      if (isNaN(dIni.getTime()) || isNaN(dFim.getTime())) {
        this.dataErro.set('Datas inválidas.');
        return;
      }
      if (dFim.getTime() < dIni.getTime()) {
        this.dataErro.set(
          'A data de fim não pode ser anterior à data de início.'
        );
        return;
      }
    }

    const atual = this.leitura();
    this.#leituraStore.update(atual!.id, {
      ...atual,
      inicio: inicioVal || '',
      fim: fimVal,
    });
    this.editandoDatas.set(false);
    this.feedback('Datas atualizadas.');
    // TODO: persistir leitura/datas
  }

  // ===== HELPERS =====

  private intervaloSemanaAtual() {
    const agora = new Date();
    const dow = (agora.getDay() + 6) % 7; // segunda=0
    const ini = new Date(agora);
    ini.setDate(agora.getDate() - dow);
    ini.setHours(0, 0, 0, 0);
    const fim = new Date(ini);
    fim.setDate(ini.getDate() + 7);
    return { iniSemana: ini, fimSemana: fim };
    // Se quiser semana iniciando no domingo, ajuste o cálculo acima.
  }

  private feedback(msg: string) {
    this.toast.set(msg);
    // limpa depois de 2.5s
    setTimeout(() => this.toast.set(null), 2500);
  }

  // Mock: remova ao integrar com store real
  private mockCapitulos(qtd: number): ICapitulo[] {
    return Array.from({ length: qtd }, (_, i) => ({
      id: i + 1,
      nome: `Capítulo ${i + 1}`,
      concluido: i < 3,
    })) as ICapitulo[];
  }
}
