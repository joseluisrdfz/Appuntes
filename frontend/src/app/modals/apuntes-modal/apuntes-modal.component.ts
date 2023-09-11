import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-apuntes-modal',
  templateUrl: './apuntes-modal.component.html',
  styleUrls: ['./apuntes-modal.component.scss'],
})
export class ApuntesModalComponent {

  filename = '';

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss('cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss('confirm');
  }

}
