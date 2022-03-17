import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiBaseUrl = environment.baseUrl + '/api';
  constructor(private http: HttpClient) { }
  list(url: string): Observable<any> {
    return this.http.get(this.apiBaseUrl + url)
  }
  add(url: string, formData: any): Observable<any>{
    return this.http.post(this.apiBaseUrl + url, formData)
  }

  update(url: string, formData: any): Observable<any>{
    return this.http.put(this.apiBaseUrl + url, formData)
  }

  delete(url: string): Observable<any> {
    return this.http.delete(this.apiBaseUrl + url)
  }
  
}
