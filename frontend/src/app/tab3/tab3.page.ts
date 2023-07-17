import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  nameUser="Jose Luis";
  nameGrado="Grado en ingeniería multimedia";

  constructor() {}

  ngOnInit() {
    /* const swiperEl = document.querySelector('swiper-container');

    const params = {
      // array with CSS styles
      injectStyles: [
        `
        :host(.red) .swiper-wrapper {
          background-color: red;
        }
        `,
      ]
    };

    Object.assign(swiperEl, params);

    swiperEl.initialize(); */
  }

}
