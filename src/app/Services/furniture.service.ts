import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Furniture } from '../Models/Furniture';
import { FurnitureCollectionResponse } from '../Models/FurnitureCollectionResponse';

@Injectable({
  providedIn: 'root'
})
export class FurnitureService {

  private baseUrl = 'http://localhost:5000/api/furniture';

  constructor(private http: HttpClient) { }

  getAll(size: number, skip: number):Observable<FurnitureCollectionResponse>{
    return this.http.get<FurnitureCollectionResponse>(`${this.baseUrl}?skip=${skip}&size=${size}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  get(id: string): Observable<Furniture>{
    return this.http.get<Furniture>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<any>{
    return this.http.delete<Furniture>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  create(furniture: Furniture): Observable<string>{
    return this.http.post<any>(this.baseUrl, furniture).pipe(
      catchError(this.handleError)
    );
  }

  update(furniture: Furniture): Observable<any>{
    return this.http.put<any>(`${this.baseUrl}/${furniture.id}`, furniture).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
