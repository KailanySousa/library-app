import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import ICategoria from './interfaces/categoria.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly url: string = 'http://localhost:8080/categorias';
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ICategoria[]> {
    return this.http.get<ICategoria[]>(this.url);
  }

  post(request: ICategoria): Observable<unknown> {
    return this.http.post(this.url, request);
  }
}
