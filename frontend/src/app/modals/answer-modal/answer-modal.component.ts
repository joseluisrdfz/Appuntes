import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-answer-modal',
  templateUrl: './answer-modal.component.html',
  styleUrls: ['./answer-modal.component.scss'],
})
export class AnswerModalComponent {

  constructor(private modalCtrl: ModalController) {}

  answer = ''

  cancel() {
    return this.modalCtrl.dismiss(null,'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.answer,'confirm');
  }

}


