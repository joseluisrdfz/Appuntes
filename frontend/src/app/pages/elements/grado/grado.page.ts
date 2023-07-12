import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { GradosService } from '../../../services/grados.service';

@Component({
  selector: 'app-grado',
  templateUrl: './grado.page.html',
  styleUrls: ['./grado.page.scss'],
})
export class GradoPage implements OnInit {
  previousUrl: string = '';
  currentUrl: string = '';

  showDesc = false;

  routerSubs : Subscription | undefined = undefined;
  id_grado = '';

  grado = '';
  uni = '';
  uni_id = '';
  descripcion = '';
  cursos = 4;
  cursoSelect = 0;
  asignaturas : any[] = [];
  asig2Show : any[] = [];

  constructor(private router: Router, private route : ActivatedRoute, private gradosService: GradosService) { }

  ngOnInit() {
    console.log('me inicio grado')


    this.id_grado = this.route.snapshot.params['id'];

    this.routerSubs = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event:any) => {

      if(event.url.includes('/tabs/tabs/grado')){
      console.log(this.router.url)
      console.log('id pregunta : ', this.id_grado, ' id del router.url: ', this.router.url.split('/')[4] )
      if(this.router.url.split('/')[4] == this.id_grado){
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
    console.log('me voy del grado', this.id_grado)
    this.routerSubs?.unsubscribe();
  }

  reload(){
    this.gradosService.getGradoId(this.id_grado).subscribe((res:any)=>{
      console.log(res)
      this.uni = res.grado_data.uni_name;
      this.uni_id = res.grado_data.id_uni;
      this.cursos = res.grado_data.cursos;
      this.descripcion = res.grado_data.grado_description;
      this.grado = res.grado_data.grado_name;
      this.asignaturas = res.asignaturas;
    })
  }

  handleChange(e:any) {
    console.log(e);
    this.cursoSelect = e.detail.value;
    console.log(this.cursoSelect)
    //this.asig2Show =.filter((asig : any ) => {asig.curso == this.cursoSelect});
    this.asig2Show = [];
    this.asignaturas.forEach((asig : any) => {
      if(asig.curso == this.cursoSelect){
        console.log(asig)
        this.asig2Show.push(asig);
      }
    })
  }

  goBack(){
    this.router.navigateByUrl(this.previousUrl , {state: { prevUrl : "/tabs/tabs/grado", changePrev : 'no'}});
  }

  goto(url:any){
    console.log('goto'+url,  '   prevUrl:', "/tabs/tabs/asignatura/" + this.id_grado)
    this.router.navigateByUrl(`/tabs/tabs${url}`,  {state: { prevUrl : "/tabs/tabs/grado/" + this.id_grado, changePrev : 'yes'}})

  }

}
