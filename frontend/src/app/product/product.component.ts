import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  activeTab = 0;
  itemImage: any;
  last = 0;
  productList: any[] = [];
  baseUrl = environment.baseUrl;
  productForm = new FormGroup({
    itemName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(new RegExp(/^[^0-9 ]{1}([a-zA-Z ])+[a-zA-Z]+$/))]),
    itemPrice: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99999.99)]),
    itemImage: new FormControl('', [Validators.required])
  })

  constructor(private productService: ProductService, private dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadMoreProduct();
  }

  loadMoreProduct(last = 0){
    let limit = 5;
    this.productService.list(`/product/list?limit=${limit}&last=${last}`).subscribe((response) => {
      this.last = response.data.last;
      this.productList = [...this.productList, ...response.data.products]; 
    });
  }
  get pf() {
    return this.productForm.controls;
  }

  updateFile(e: any) {
    this.itemImage = e.target.files[0]
  }

  submit() {
    let form = new FormData()
    form.append('itemName', this.productForm.value.itemName);
    form.append('itemPrice', this.productForm.value.itemPrice);

    form.append('itemImage', this.itemImage);
    this.productService.add('/product/add', form).subscribe((response) => {
      this.productForm.reset()
      this.toastr.success(response.message);
      this.productList.unshift(response.data)
    })
    console.log(form)
  }

  edit(item: Object) {
    let dialogRef = this.dialog.open(EditDialogComponent, {
      data: item
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateProductList(result)
      }
    });
  }

  delete(id: string) {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.productService.delete('/product/delete/' + result).subscribe((response) => {
          this.toastr.success(response.message);
          this.updateProductList(result)
        })
      }
    })
  }

  updateProductList(data: any){
    const id = data?.itemId?data?.itemId:data
    const index = this.productList.findIndex(d => d.itemId == id);
    if(typeof data == 'string'){
      this.productList.splice(index, 1)
    } else {
      this.productList[index] = data;
    }
  }

  onScroll(event: any){
    if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      this.loadMoreProduct(this.last)
    }
  }
}
