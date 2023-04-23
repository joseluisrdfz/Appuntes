import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { INTRO_KEY } from 'src/app/guards/intro.guard';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  constructor(private storage: Storage, private router: Router) { }

  ngOnInit() {
  }

  async start(destination : any) {
    await this.storage.create()

		await this.storage.set(INTRO_KEY, 'true' );

		this.router.navigateByUrl(destination, { replaceUrl: true });
	}

}
