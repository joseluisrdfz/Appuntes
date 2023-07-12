import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GradoPageRoutingModule } from './grado-routing.module';

import { GradoPage } from './grado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GradoPageRoutingModule
  ],
  declarations: [GradoPage]
})
export class GradoPageModule {}
