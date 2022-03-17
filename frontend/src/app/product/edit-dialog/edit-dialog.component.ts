import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  itemImage: any;
  productForm = new FormGroup({
    itemId: new FormControl(''),
    itemName: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(new RegExp(/^[^0-9 ]{1}([a-zA-Z ])+[a-zA-Z]+$/))]),
    itemPrice: new FormControl('', [Validators.required, Validators.min(1), Validators.max(99999.99)]),
    itemImage: new FormControl('', [Validators.required])
  })
  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { itemId: string, itemName: string, itemPrice: Number, itemImage: string }, private productService: ProductService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.productForm.patchValue({ itemId: this.data.itemId, itemName: this.data.itemName, itemPrice: this.data.itemPrice })
  }

  get pf() {
    return this.productForm.controls;
  }

  updateFile(e: any) {
    this.itemImage = e.target.files[0]
  }

  update(){    
      let form = new FormData()
      form.append('itemName', this.productForm.value.itemName);
      form.append('itemPrice', this.productForm.value.itemPrice);
      form.append('itemImage', this.itemImage);
      this.productService.update('/product/update/' + this.productForm.value.itemId, form).subscribe((response) => {
        this.toastr.success(response.message);
        this.dialogRef.close(response.data)
      });
  }



}
