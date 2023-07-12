import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UniPageRoutingModule } from './uni-routing.module';

import { UniPage } from './uni.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UniPageRoutingModule
  ],
  declarations: [UniPage]
})
export class UniPageModule {}
