import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal } from '@angular/core';
import ICategoria from './interfaces/categoria.interface';
import { filter, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly url: string = 'http://localhost:8080/categorias';

  private categorias = signal<ICategoria[]>([]);

  public listaCategorias: Signal<ICategoria[]> = this.categorias.asReadonly();

  constructor(private readonly http: HttpClient) {}

  getItem(id: number): ICategoria {
    return this.listaCategorias.call(
      filter((categoria: ICategoria) => categoria?.id === id)
    )[0];
  }

  getAll(): Observable<ICategoria[]> {
    return this.http
      .get<ICategoria[]>(this.url)
      .pipe(tap((data) => this.categorias.set(data)));
  }

  post(request: ICategoria): Observable<unknown> {
    return this.http.post(this.url, request);
  }

  put(id: number, request: ICategoria): Observable<unknown> {
    return this.http.put(this.url + '/' + id, request);
  }

  delete(id: number): Observable<unknown> {
    return this.http.delete(this.url + '/' + id);
  }
}
