import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HomeService } from './home.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  productList: any = [];
  perRow = 2;
  last = 0;
  baseUrl = environment.baseUrl;
  cart: any = [];
  total = new BehaviorSubject(0);
  constructor(private homeService: HomeService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadMoreProduct();
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cart = JSON.parse(cartData);
      this.totalRefresh();
    }
  }

  loadMoreProduct(last = 0) {
    let limit = this.perRow * 2;
    this.homeService.list(`/product/list?limit=${limit}&last=${last}`).subscribe((response) => {
      this.last = response.data.last;
      this.productList = [...this.productList, ...response.data.products];
    })
  }

  addToCart(row: any) {
    const data = this.homeService.addCart(row)
    if (data) {
      this.toastr.success('Item added successfully')
      this.cart = data;
      this.totalRefresh();
    }
  }

  onScroll(event: any) {
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.loadMoreProduct(this.last)
      console.log(this.perRow * 2)
    }
  }

  totalRefresh() {
    this.total.next(this.cart.reduce((total: number, item: any) => {
      return total + (parseFloat(item.itemPrice) * parseInt(item.quantity));
    }, 0));
  }

}
