import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { ProductRoutingModule } from './product-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from './product.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { HttpErrorInterceptor } from '../http-error.interceptor';


@NgModule({
  declarations: [
    ProductComponent,
    DeleteDialogComponent,
    EditDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    ProductRoutingModule,
    MatDialogModule
  ],
  providers:[ProductService,{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],
  exports:[DeleteDialogComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductModule { }
