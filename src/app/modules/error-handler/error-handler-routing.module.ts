import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorOccuredComponent } from './error-occured/error-occured.component';
import { FileNotFoundComponent } from './file-not-found/file-not-found.component';
import { PermissionDeniedComponent } from './permission-denied/permission-denied.component';


const routes: Routes = [
  {
    path: 'permission-denied',
    component: PermissionDeniedComponent
  },
  {
    path: 'file-not-found',
    component: FileNotFoundComponent
  },
  {
    path: 'error-occured',
    component: ErrorOccuredComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorHandlerRoutingModule { }
