import { Component } from '@angular/core';
import { UsersService } from '../services/users.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {


  /* [
    {
        "id_apuntes": 4,
        "filename": "Hubside.pdf",
        "titlename": "Convoluciones y otras cosas",
        "visualizaciones": 0,
        "downloads": 0,
        "description": "Este tema va sobre como hacer convoluciones sobre un set de datos dado es un ejercicio de examen",
        "upload_datetime": "2023-06-16T19:09:28.000Z",
        "user": 1,
        "asignatura_id": 1,
        "asignatura_name": "Sonido y musica por computador",
        "grado_name": "Grado en Ingenieria Multimedia",
        "preguntas": 0,
        "type": "APUNTES"
    },
    {
        "id_pregunta": 3,
        "texto_pregunta": "¿Cómo se usa el MIDI?",
        "upload_datetime": "2023-06-14T19:05:33.000Z",
        "user_id": 8,
        "respuestas": 0,
        "asignatura_name": "Sonido y musica por computador",
        "asignatura_id": 1,
        "grado_name": "Grado en Ingenieria Multimedia",
        "apuntes_title": null,
        "apuntes_id": null,
        "type": "PREGUNTAS"
    }
] */

  list : any[] = [];
  constructor(private userService : UsersService, private router : Router) {

    userService.getFeed().subscribe((res:any)=>{
      //console.log(res)

      res['apuntes'].forEach((apunte : any ) =>{
        apunte.type = 'APUNTES';

        this.list.push(apunte);


      })

      res['preguntas'].forEach((pregunta : any ) =>{
        pregunta.type = 'PREGUNTAS';
        this.list.push(pregunta);

        if(pregunta.asignatura_name==null && pregunta.grado_name==null){
          pregunta.asignatura_name = pregunta.apuntes_asignatura
          pregunta.grado_name=pregunta.apuntes_grado
        }
      })

      this.list = this.list.sort(this.compareDates);
     /*

      let aux = new Date (590000)

      aux.setUTCMilliseconds(0)

      //console.log(aux) */

      this.list.forEach((element:any)=>{

        let date : Date = new Date(element.upload_datetime);

        element.fechaFormateada = this.formatDate(date);
      })

    })

  }

  ngOnInit(){
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
  ).subscribe((event:any) => {

    if(event.url.includes('/tabs/tabs/tab2')){
      this.reload();
    }
  });
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

  reload(){
    let aux : any[]= [];
    this.userService.getFeed().subscribe((res:any)=>{
      //console.log(res)

      res['apuntes'].forEach((apunte : any ) =>{
        apunte.type = 'APUNTES';

        aux.push(apunte);


      })

      res['preguntas'].forEach((pregunta : any ) =>{
        pregunta.type = 'PREGUNTAS';
        aux.push(pregunta);

        //console.log(pregunta.apuntes_asignatura)

        if(pregunta.asignatura_name==null && pregunta.grado_name==null){
          pregunta.asignatura_name = pregunta.apuntes_asignatura
          pregunta.grado_name=pregunta.apuntes_grado
        }
      })

      aux = aux.sort(this.compareDates);
     /*

      let aux = new Date (590000)

      aux.setUTCMilliseconds(0)

      //console.log(aux) */

      aux.forEach((element:any)=>{

        let date : Date = new Date(element.upload_datetime);

        element.fechaFormateada = this.formatDate(date);
      })

      this.list = aux;

    })
  }

  goto(url:any){
    console.log('goto'+url,  '   prevUrl:', "/tabs/tabs/tab2")

    this.router.navigateByUrl('/tabs/tabs'+url,  {state: { prevUrl : "/tabs/tabs/tab2", changePrev : 'yes'}})

  }

}
