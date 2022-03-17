import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  apiBaseUrl = environment.baseUrl + '/api';
  constructor(private http: HttpClient, private toastr: ToastrService) { }
  list(url: string): Observable<any> {
    return this.http.get(this.apiBaseUrl + url)
  }

  addCart(data: any){
    let cart: any = localStorage.getItem('cart');
    if(cart){
      cart = JSON.parse(cart);
    } else {
      cart = [];
    }
    const index = cart.findIndex((d: any) => d.itemId == data.itemId);
    if(index == -1){
      cart.push(Object.assign(data, {quantity:1}));
      localStorage.setItem('cart', JSON.stringify(cart))
      return cart;
    } else {
      this.toastr.error("Item already added in your cart");
      return false
    }
  }
}
