import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  segmentValue = 'all';

  result : any[] = [];

  constructor(private authService : AuthenticationService, private userService: UsersService, private router : Router) {}

  logout(){
    this.authService.logout();
  }

  changeSegment(event:any){
    this.segmentValue = event.detail.value;
  }

  buscar(event:any){
    this.userService.getBusqueda(event.target.value.toLowerCase()).subscribe((res:any)=>{
      console.log(res)

      this.result = [];

      let aux = res.grados;

      aux.forEach((grado : any) =>{
        grado.type = 'grados';
        this.result.push(grado);
      })

      aux = res.universidades;

      aux.forEach((uni : any) =>{
        uni.type = 'universidades';
        this.result.push(uni);
      })

      aux = res.apuntes;

      aux.forEach((apuntes : any) =>{
        apuntes.type = 'apuntes';
        let date : Date = new Date(apuntes.upload_datetime);

        apuntes.fechaFormateada = this.formatDate(date);
        this.result.push(apuntes);
      })

      aux = res.asignaturas;

      aux.forEach((asig : any) =>{
        asig.type = 'asignaturas';
        this.result.push(asig);
      })

      aux = res.preguntas;

      aux.forEach((pregunta : any) =>{
        pregunta.type = 'preguntas';
        let date : Date = new Date(pregunta.upload_datetime);

        pregunta.fechaFormateada = this.formatDate(date);

        if(pregunta.asignatura_name==null && pregunta.grado_name==null){
          pregunta.asignatura_name = pregunta.apuntes_asignatura
          pregunta.grado_name=pregunta.apuntes_grado
          pregunta.asignatura_id = pregunta.apuntes_asignatura_id
        }

        this.result.push(pregunta);
      })

      aux = res.respuestas;

      aux.forEach((respuesta : any) =>{
        respuesta.type = 'respuestas';
        let date : Date = new Date(respuesta.upload_datetime);

        respuesta.fechaFormateada = this.formatDate(date);
        this.result.push(respuesta);
      })

      aux = res.usuarios;

      aux.forEach((user : any) =>{
        user.type = 'usuarios';
        this.result.push(user);
      })

    })
  }

  formatDate(date: Date){

    let fechaSalida = '';

    const aux = Date.now() - date.getTime();

    if(Math.floor(aux*0.001) < 60 ){

      fechaSalida =  Math.floor(aux*0.001) + ' s';


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

  goto(url:any){
    console.log('goto'+url,  '   prevUrl:', "/tabs/tabs/tab2")

    this.router.navigateByUrl('/tabs/tabs'+url,  {state: { prevUrl : "/tabs/tabs/tab1", changePrev : 'yes'}})

  }

}
