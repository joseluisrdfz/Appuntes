import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  userinfo : Object= '';
  base_src = '../../assets/uploads/profilePics/';
  src = this.base_src + 'default.webp';
  name_surname='';
  username = '';
  grado='';
  uni='';

  uniId='';
  gradoId='';

  followers='';
  apuntes='';
  preguntas='';
  respuestas='';

  previousUrl = '';
  id_user = '';

  routerSubs : Subscription | undefined = undefined;

  constructor(private router: Router, private route : ActivatedRoute) {
    //console.log(this.router.getCurrentNavigation())

  }

  ngOnInit() {
    console.log('me inicio user')


    this.id_user = this.route.snapshot.params['id'];

    this.routerSubs = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event:any) => {

      if(event.url.includes('/tabs/tabs/user')){
      console.log(this.router.url)
      console.log('id user : ', this.id_user, ' id del router.url: ', this.router.url.split('/')[4] )
      if(this.router.url.split('/')[4] == this.id_user){
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
    console.log('me voy del usuario', this.id_user)
    this.routerSubs?.unsubscribe()
  }

  goBack(){
    this.router.navigateByUrl(this.previousUrl , {state: { prevUrl : "/tabs/tabs/preguntas", changePrev : 'no'}});
  }


}
