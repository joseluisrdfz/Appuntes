import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UniPage } from './uni.page';

const routes: Routes = [
  {
    path: '',
    component: UniPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UniPageRoutingModule {}
