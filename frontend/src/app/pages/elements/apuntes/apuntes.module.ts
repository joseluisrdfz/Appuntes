import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApuntesPageRoutingModule } from './apuntes-routing.module';

import { ApuntesPage } from './apuntes.page';

import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfViewerModule,
    ApuntesPageRoutingModule
  ],
  declarations: [ApuntesPage]
})
export class ApuntesPageModule {}
