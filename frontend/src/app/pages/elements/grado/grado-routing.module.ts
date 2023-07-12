import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GradoPage } from './grado.page';

const routes: Routes = [
  {
    path: '',
    component: GradoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GradoPageRoutingModule {}
