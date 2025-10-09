import { Component, inject, input } from '@angular/core';
import { CategoriaPipe } from '../../../shared/pipes/categoria.pipe';
import { AutorPipe } from '../../../shared/pipes/autor.pipe';
import ILivro from '../../../shared/interfaces/livro.interface';
import { SlicePipe, UpperCasePipe } from '@angular/common';
import { CategoriaService } from '../../../shared/services/categoria.service';

@Component({
  selector: 'app-card-livro',
  imports: [CategoriaPipe, AutorPipe, SlicePipe, UpperCasePipe],
  templateUrl: './card-livro.component.html',
})
export class CardLivroComponent {
  livro = input.required<ILivro>();
  #categoriaService = inject(CategoriaService);

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const to = (x: string) => parseInt(x, 16);
    if (!m) return { r: 139, g: 92, b: 246 };
    return { r: to(m[1]), g: to(m[2]), b: to(m[3]) };
  }

  private clamp(n: number) {
    return Math.max(0, Math.min(255, n));
  }

  private darken(hex: string, amt = 20): string {
    const { r, g, b } = this.hexToRgb(hex);
    const rr = this.clamp(r - (255 * amt) / 100);
    const gg = this.clamp(g - (255 * amt) / 100);
    const bb = this.clamp(b - (255 * amt) / 100);
    return `rgb(${rr}, ${gg}, ${bb})`;
  }

  private pickBaseColor(cor?: string): string {
    return cor || '#D946EF';
  }

  gradientFor(categoriaId: string): string {
    const cor = this.#categoriaService.getItem(
      Number.parseInt(categoriaId)
    ).cor;
    const base = this.pickBaseColor(cor);
    const to = this.darken(base, 28);
    return `linear-gradient(135deg, ${base}, ${to})`;
  }
}
