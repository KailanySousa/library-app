import { Component, computed, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditoraStore } from '../../shared/stores/editora.store';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ListaVaziaComponent } from '../../shared/components/lista-vazia/lista-vazia.component';

@Component({
  selector: 'app-editoras',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, ListaVaziaComponent],
  templateUrl: './editoras.component.html',
})
export class EditorasComponent {
  #editorasStore = inject(EditoraStore);
  #router = inject(Router);

  editoras = computed(() => this.#editorasStore.editoras());

  remover(id: number) {
    if (confirm('Remover esta autor? (não remove livros)')) {
      this.#editorasStore.remove(id);
      void this.#router.navigate(['/editoras']);
    }
  }
}
