import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorHandlerRoutingModule } from "./error-handler-routing.module";

import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';
import { FileNotFoundComponent } from './file-not-found/file-not-found.component';
import { ErrorOccuredComponent } from './error-occured/error-occured.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    PermissionDeniedComponent,
    FileNotFoundComponent,
    ErrorOccuredComponent,
  ],
  imports: [
    CommonModule,
    ErrorHandlerRoutingModule,
    SharedModule
  ]
})
export class ErrorHandlerModule { }
