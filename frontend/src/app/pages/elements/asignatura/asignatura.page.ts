import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { PreguntasService } from 'src/app/services/preguntas.service';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.page.html',
  styleUrls: ['./asignatura.page.scss'],
})
export class AsignaturaPage implements OnInit {
  previousUrl: string = '';
  currentUrl: string = '';

  routerSubs : Subscription | undefined = undefined;

  id_asig = '';

    uni_name = '';
    uni_id = '';
    grado_name = '';
    grado_id='';
    asig_name = '';
    curso = '';
    description = '';
    apuntes_n = '';
    apuntes : any[] = [];
    preguntas_n = '';
    preguntas : any[] = [];
    seguidores = '';

    seguido = 0;
    msgbtn = 'Seguir asignatura';
    fillbtn = 'solid'

    menuState = 1;




  constructor(private router: Router, private route : ActivatedRoute, private asigService : AsignaturaService) {
    //console.log(this.router.getCurrentNavigation())

  }


  ngOnInit() {
    console.log('me inicio asig')


    this.id_asig = this.route.snapshot.params['id'];

    this.routerSubs = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event:any) => {

      if(event.url.includes('/tabs/tabs/asignatura')){
      console.log(this.router.url)
      console.log('id asig : ', this.id_asig, ' id del router.url: ', this.router.url.split('/')[4] )
      if(this.router.url.split('/')[4] == this.id_asig){
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
    console.log('me voy de la asignatura', this.id_asig)
    this.routerSubs?.unsubscribe();
  }

  reload(){
    this.asigService.getAsignaturaId(this.id_asig).subscribe((res:any)=>{
      console.log(res)

      this.uni_name = res.asigData.uni_name;
      this.uni_id = res.asigData.uni_id;
      this.grado_name = res.asigData.grado_name;
      this.grado_id= res.asigData.grado;
      this.asig_name = res.asigData.name;
      this.curso = res.asigData.curso;
      this.description = res.asigData.description;
      this.apuntes_n = res.apuntes.length;
      this.apuntes = res.apuntes;
      this.preguntas_n = res.preguntas.length;
      this.preguntas = res.preguntas;
      this.seguidores = res.asigData.seguidores;
      this.seguido = res.seguido;

      if(this.seguido === 1){
        this.msgbtn = 'Dejar de seguir';
        this.fillbtn = "outline"
      } else{
        this.msgbtn = 'Seguir asignatura';
        this.fillbtn = 'solid'
      }

      if(this.apuntes!=undefined && this.apuntes.length>0){
        this.apuntes = this.apuntes.sort(this.compareDates);

        this.apuntes.forEach((element:any)=>{

          let date : Date = new Date(element.upload_datetime);

          element.fechaFormateada = this.formatDate(date);
        })
      }

     if(this.preguntas!=undefined && this.preguntas.length>0){
      this.preguntas = this.preguntas.sort(this.compareDates);

      this.preguntas.forEach((element:any)=>{

        if(element.asignatura_name==null && element.grado_name==null){
          element.asignatura_name = element.apuntes_asignatura
          element.grado_name=element.apuntes_grado
        }

        let date : Date = new Date(element.upload_datetime);

        element.fechaFormateada = this.formatDate(date);
      })
     }
    })
  }

  changeState(state : number){
    this.menuState = state;
  }

  goBack(){
    this.router.navigateByUrl(this.previousUrl , {state: { prevUrl : "/tabs/tabs/asignatura", changePrev : 'no'}});
  }

  goto(url:any){
    console.log('goto'+url,  '   prevUrl:', "/tabs/tabs/asignatura/" + this.id_asig)
    this.router.navigateByUrl(`/tabs/tabs${url}`,  {state: { prevUrl : "/tabs/tabs/asignatura/" + this.id_asig, changePrev : 'yes'}})

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



  formatDate(date: Date){

    let fechaSalida = '';

    /* 1 milisegundo
        0.001 segundos
        0.0000166667 minutos
        2.7777777777777776×10-7 horas
        1.1574074074074074×10-8 dias

        la fechar en formato dd-mm-aaaa
        let date : Date = new Date(element.upload_datetime);

        element.fechaFormateada = this.formatDate(date);

    */
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

  followAsig(){
    this.asigService.followAsig(this.id_asig).subscribe((value:any) =>{
      console.log(value);

    /*   if(value.seguidoBool){
        this.seguido = 'outline'
        this.messageBtn = 'Dejar de seguir'
      } else{
        this.seguido = 'solid'
        this.messageBtn = 'Seguir a usuario'
      } */

      this.reload()
    });

  }


}
