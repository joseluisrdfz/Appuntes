import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ApuntesService } from 'src/app/services/apuntes.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { Subscription } from 'rxjs';
import { PreguntasService } from 'src/app/services/preguntas.service';
import { Form } from '@angular/forms';

@Component({
  selector: 'app-apuntes',
  templateUrl: './apuntes.page.html',
  styleUrls: ['./apuntes.page.scss'],
})
export class ApuntesPage implements OnInit {

  @ViewChild(IonModal) modal: IonModal | undefined;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  question: string = '';

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal?.dismiss(this.question, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      let auxform = {
        texto_pregunta : this.question
      }
      this.preguntasService.postPreguntaApuntes(this.id_apuntes,auxform).subscribe((res :any)=>{
        console.log(res)
        this.question = '';
        this.goto('/preguntas/' + res['insertID'])
      })
    }
  }


    previousUrl: string = '';
    currentUrl: string = '';

    asignatura_name = '';
    asignatura_id='';
    grado='';
    gradoId='';

    fechaFormateada='';
    titleName='';
    descripcion='';
    downloads='';
    filename ='';
    visualizaciones = '';

    user_id='';
    userName='';

    baseSrc='../../../../assets/uploads/profilePics/';

    profilePicsrc= this.baseSrc + 'default.webp';


    preguntas : any[] = [];


    routerSubs : Subscription | undefined = undefined;

    id_apuntes : string = '';
    constructor(private router: Router, private route : ActivatedRoute, private apuntesService : ApuntesService, private preguntasService : PreguntasService) {
      //console.log(this.router.getCurrentNavigation())

    }

    ngOnInit() {
      console.log('me inicio apunte')

      this.id_apuntes = this.route.snapshot.params['id'];

      this.routerSubs = this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd)
      ).subscribe((event:any) => {

      if(event.url.includes('/tabs/tabs/apuntes')){
        console.log(this.router.url)
        console.log('id_apuntes : ', this.id_apuntes, ' id de la snapshot: ', this.route.snapshot.params['id'], ' id del router.url: ', this.router.url.split('/')[4] )
        if(this.router.url.split('/')[4] == this.id_apuntes){
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
      console.log('me voy de los', this.id_apuntes)
      this.routerSubs?.unsubscribe()
    }

reload(){
  this.apuntesService.getApuntesById(this.id_apuntes).subscribe((res:any)=>{
    console.log(res)
    this.asignatura_name = res['apuntes'].asignatura_name;
    this.asignatura_id=res['apuntes'].asignatura;
    this.grado=res['apuntes'].grado;
    this.gradoId=res['apuntes'].gradoId;

    let date : Date = new Date(res['apuntes'].upload_datetime);

    this.fechaFormateada = this.formatDate(date);
    this.titleName=res['apuntes'].titlename;
    this.descripcion=res['apuntes'].description;
    this.downloads=res['apuntes'].downloads;
    this.visualizaciones = res['apuntes'].visualizaciones;
    this.filename =res['apuntes'].filename;
    this.user_id=res['apuntes'].user;
    this.userName=res['apuntes'].user_username;
    this.profilePicsrc= this.baseSrc + res['apuntes'].user_profilePic;

    this.preguntas = res['preguntas'];

    this.preguntas.forEach((preg : any )=>{
      preg.user_profilePic = this.baseSrc + preg.user_profilePic
      preg.fechaFormateada = this.formatDate(new Date (preg.upload_datetime));
    })

    this.preguntas = this.preguntas.sort(this.compareDates);
  })
}

    goBack(){
      this.router.navigateByUrl(this.previousUrl, {state: { prevUrl : "/tabs/tabs/apuntes/", changePrev : 'no'}});
    }

    goto(url:any){
      console.log('goto'+url,  '   prevUrl:', "/tabs/tabs/apuntes" + this.id_apuntes)
      this.router.navigateByUrl(`/tabs/tabs${url}`,  {state: { prevUrl : "/tabs/tabs/apuntes/" + this.id_apuntes, changePrev : 'yes'}})

    }

    formatDate(date: Date){

      let fechaSalida = '';

      const aux = Date.now() - date.getTime();

      //console.log(aux)

      if(Math.floor(aux*0.001) < 60 ){

        fechaSalida =  Math.floor(aux*0.001) + ' s';
        //console.log('aux:', aux, '  , seg:', Math.floor(aux*0.001))

      } else if(Math.floor(aux*0.0000166667) < 60){

        fechaSalida = Math.floor(aux*0.0000166667)+ ' m';

      } else if(Math.floor(aux*(2.7777777777777776 * Math.pow(10, -7))) < 24){

        fechaSalida = Math.floor(aux*(2.7777777777777776 * Math.pow(10, -7)))+ ' h';

      } else if(Math.floor(aux*(1.1574074074074074 * Math.pow(10, -8))) < 3){

        fechaSalida = Math.floor(aux*(1.1574074074074074 * Math.pow(10, -8)))+ ' d';

      } else {
        fechaSalida = date.getDate()   + '-' + date.getMonth() +'-' + date.getFullYear();
      }


      return fechaSalida
    }

    compareDates (a : any, b : any) {
      if (Date.parse(a['upload_datetime']) > Date.parse(b['upload_datetime'])) {
        //a es menor que b según criterio de ordenamiento
        return -1;
      }
      if (Date.parse(b['upload_datetime']) > Date.parse(a['upload_datetime'])) {
        //a es mayor que b según criterio de ordenamiento
        return 1;
      }
      // a debe ser igual b
      return 0;
    }





}
