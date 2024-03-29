import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { PreguntasService } from 'src/app/services/preguntas.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { Subscription } from 'rxjs';
import { AnswerModalComponent } from 'src/app/modals/answer-modal/answer-modal.component';

@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.page.html',
  styleUrls: ['./preguntas.page.scss'],
})
export class PreguntasPage implements OnInit {
      previousUrl: string = '';
      currentUrl: string = '';

      routerSubs : Subscription | undefined = undefined;

      id_pregunta : string = '';
      n_respuestas : string = '';
      profilePic : string = '';
      user : string = '';
      username : string = '';
      texto_pregunta : string = '';
      fechaFormateada : string = '';
      baseSrc='../../../../assets/uploads/profilePics/';

      respuestas : any[] = [];

      constructor(private router: Router, private route : ActivatedRoute, private preguntasService : PreguntasService, private modalCtrl: ModalController) {
        //console.log(this.router.getCurrentNavigation())

      }


      ngOnInit() {
        console.log('me inicio pregunta')


        this.id_pregunta = this.route.snapshot.params['id'];

        this.routerSubs = this.router.events.pipe(
          filter((event) => event instanceof NavigationEnd)
        ).subscribe((event:any) => {

          if(event.url.includes('/tabs/tabs/preguntas')){
          console.log(this.router.url)
          console.log('id pregunta : ', this.id_pregunta, ' id del router.url: ', this.router.url.split('/')[4] )
          if(this.router.url.split('/')[4] == this.id_pregunta){
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
        console.log('me voy de la pregunta', this.id_pregunta)
        this.routerSubs?.unsubscribe();
      }


      reload(){
        this.preguntasService.getPreguntaId(this.id_pregunta).subscribe((res:any)=>{
          console.log(res);
          this.n_respuestas = res.pregunta['n_respuestas'];
          this.username = res.pregunta.username;
          this.profilePic = this.baseSrc + res.pregunta.profilePic;
          this.texto_pregunta = res.pregunta['texto_pregunta'];
          this.fechaFormateada = this.formatDate(new Date (res.pregunta.upload_datetime));
          this.user = res.pregunta.user_id;
          this.respuestas = res.respuestas;

          this.respuestas.forEach((resp : any) =>{
            resp.profilePic = this.baseSrc + resp.profilePic;
            resp.fechaFormateada =this.formatDate(new Date ( resp.upload_datetime ));
          })

          this.respuestas = this.respuestas.sort(this.compareDates)

        })
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


      goBack(){
        this.router.navigateByUrl(this.previousUrl , {state: { prevUrl : "/tabs/tabs/preguntas", changePrev : 'no'}});
      }

      goto(url:any){
        console.log('goto'+url,  '   prevUrl:', "/tabs/tabs/pregnutas/"+this.id_pregunta)

        this.router.navigateByUrl('/tabs/tabs'+url,  {state: { prevUrl : `/tabs/tabs/preguntas/${this.id_pregunta}`, changePrev : 'yes'}})

      }

    async openAnswer() {
      const modal = await this.modalCtrl.create({
        component: AnswerModalComponent
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();

      if (role === 'confirm') {
       let auxform = {
          texto_respuesta : data
        }
        this.preguntasService.postRespuestaOnPreguntaId(this.id_pregunta,auxform).subscribe((res :any)=>{
          this.reload();
        })
      }
    }
}

