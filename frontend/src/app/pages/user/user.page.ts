import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter, Subject } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  base_src = '../../assets/uploads/profilePics/';
  profilePic = 'default.webp';
  src = this.base_src + this.profilePic;
  name_surname='';
  username = '';
  grado='';
  uni='';
  curso = '';
  uniId='';
  gradoId='';

  followers='';
  napuntes='';
  npreguntas='';
  nrespuestas='';

  apuntes : any[] = [] ;
  preguntas: any[] = [] ;
  respuestas: any[] = [] ;


  previousUrl = '';
  id_user = '';

  perfilprofio = true;
  messageBtn = 'Seguir a usuario';
  seguido = 'solid';

  menuState = 1; //1 - apuntes, 2 - preg, 3 - resp

  routerSubs : Subscription | undefined = undefined;

  constructor(private router: Router, private route : ActivatedRoute, private usersService : UsersService) {
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
      if(this.router.url.split('/')[4] === this.id_user){
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
    console.log('me voy del usuario', this.id_user)
    this.routerSubs?.unsubscribe()
  }

  reload(){
    this.usersService.getUserInfoId(this.id_user).subscribe((res : any ) => {
      console.log(res)
      this.name_surname=`${res.datos.name} ${res.datos.surname}`;
      this.username = res.datos.username;
      this.grado=res.datos.grado_name;
      this.uni=res.datos.uni_name;
      this.uniId=res.datos.uni;
      this.gradoId=res.datos.grado;
      this.followers=res.datos.seguidores;
      this.napuntes=res.datos.apuntes;
      this.npreguntas=res.datos.preguntas;
      this.nrespuestas=res.datos.respuestas;
      this.curso = res.datos.curso;
      this.perfilprofio = res.perfilpropio;
      if(res.seguido.seguido == 1){
        this.seguido = 'outline'
        this.messageBtn = 'Dejar de seguir'
      } else {
        this.messageBtn = 'Seguir a usuario';
        this.seguido = 'solid';
      }

      this.profilePic = res.datos.profilePic;
      this.src = this.base_src + this.profilePic;

      this.respuestas=res.respuestas;
      this.apuntes=res.apuntes;
      this.preguntas=res.preguntas;

      if(this.respuestas!=undefined && this.respuestas.length>0){
        this.respuestas = this.respuestas.sort(this.compareDates);

        this.respuestas.forEach((element:any)=>{
          element.profilePic = this.base_src + element.profilePic;

          let date : Date = new Date(element.upload_datetime);

          element.fechaFormateada = this.formatDate(date);
        })
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

  goBack(){
    this.router.navigateByUrl(this.previousUrl , {state: { prevUrl : "/tabs/tabs/preguntas", changePrev : 'no'}});
  }

  changeState(state : number){
    this.menuState = state;
  }

  goto(url:any){
    console.log('goto'+url,  '   prevUrl:', "/tabs/tabs/user/" + this.id_user)
    this.router.navigateByUrl(`/tabs/tabs${url}`,  {state: { prevUrl : "/tabs/tabs/user/" + this.id_user, changePrev : 'yes'}})

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

  followUser(){
    this.usersService.followUser(this.id_user).subscribe((value:any) =>{
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
