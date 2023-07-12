import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-uni',
  templateUrl: './uni.page.html',
  styleUrls: ['./uni.page.scss'],
})
export class UniPage implements OnInit {

  previousUrl: string = '';
  currentUrl: string = '';

  routerSubs : Subscription | undefined = undefined;
  id_uni = '';

  constructor(private router: Router, private route : ActivatedRoute) { }

  ngOnInit() {
    console.log('me inicio uni')


    this.id_uni = this.route.snapshot.params['id'];

    this.routerSubs = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event:any) => {

      if(event.url.includes('/tabs/tabs/uni')){
      console.log(this.router.url)
      console.log('id uni : ', this.id_uni, ' id del router.url: ', this.router.url.split('/')[4] )
      if(this.router.url.split('/')[4] == this.id_uni){
        //this.reload();
      }

      if(this.router.getCurrentNavigation()?.extras?.state != undefined){
        let aux : any = this.router.getCurrentNavigation()?.extras?.state
        if(aux['changePrev']==='yes')
        this.previousUrl = aux['prevUrl'];
      }
    }
  });

  }

  ngOnDestroy(){
    console.log('me voy de la uni', this.id_uni)
    this.routerSubs?.unsubscribe();
  }

  goBack(){
    this.router.navigateByUrl(this.previousUrl , {state: { prevUrl : "/tabs/tabs/uni", changePrev : 'no'}});
  }
}
