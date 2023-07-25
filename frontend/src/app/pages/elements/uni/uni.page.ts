import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { GradosService } from 'src/app/services/grados.service';
import { UniversitiesService } from 'src/app/services/universities.service';

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
  uni = '';
  address = '';
  logo = '';
  grados : any[] = [];

  constructor(private router: Router, private route : ActivatedRoute, private uniService : UniversitiesService, private gradoService: GradosService) { }

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
        this.reload();
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

  reload(){
    this.uniService.getUniId(this.id_uni).subscribe((res:any)=>{
      console.log(res)
      this.uni = res.universidades[0].name;
      this.logo = res.universidades[0].logo;
      this.address = res.universidades[0].address;
      this.gradoService.getGradosByUni(this.id_uni).subscribe((res:any)=>{
        this.grados = res.grados;
      })

    })
  }

  goBack(){
    this.router.navigateByUrl(this.previousUrl , {state: { prevUrl : "/tabs/tabs/uni", changePrev : 'no'}});
  }


  goto(url:any){
    console.log('goto'+url,  '   prevUrl:', "/tabs/tabs/uni/" + this.id_uni)
    this.router.navigateByUrl(`/tabs/tabs${url}`,  {state: { prevUrl : "/tabs/tabs/uni/" + this.id_uni, changePrev : 'yes'}})

  }
}
