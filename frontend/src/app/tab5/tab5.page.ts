import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { GradosService } from '../services/grados.service';
import { UniversitiesService } from '../services/universities.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  userinfo : Object= '';
  base_src = '../../assets/uploads/profilePics/';
  src = this.base_src + 'default.webp';
  name_surname='';
  username = '';
  grado='';
  uni='';
  user_id = '';

  uniId='';
  gradoId='';

  followers='';
  apuntes='';
  preguntas='';
  respuestas='';


  constructor(private router : Router, private usersService : UsersService, private gradoService : GradosService, private uniService: UniversitiesService, private authService: AuthenticationService) {
    this.usersService.getUserMyInfo().subscribe((res:any)=>{
      this.userinfo = res['userinfo'][0];
      this.user_id = res['userinfo'][0]['user_id'];
      this.name_surname=`${res['userinfo'][0]['name']} ${res['userinfo'][0]['surname']}`;
      this.username = res['userinfo'][0]['username'];
      this.followers=res['userinfo'][0]['seguidores'];
      this.apuntes=res['userinfo'][0]['apuntes'];
      this.preguntas=res['userinfo'][0]['preguntas'];
      this.respuestas=res['userinfo'][0]['respuestas'];
      this.uniId = res['userinfo'][0]['uni'];
      this.gradoId = res['userinfo'][0]['grado'];
      this.src = this.base_src + res['userinfo'][0]['profilePic'];

      this.uniService.getUniId(this.uniId).subscribe((res)=>{
        this.uni = res['universidades'][0]['name'];
        this.gradoService.getGradoId(this.gradoId).subscribe((res:any)=>{
          this.grado =  res['grado_data']['grado_name'];
        })
      })
    })

   }

  ngOnInit() {
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/intro', { replaceUrl:true });
  }

  goto(url :any){
    this.router.navigateByUrl(`/tabs/tabs${url}`,  {state: { prevUrl : "/tabs/tabs/tab5", changePrev : 'yes'}})
  }

}
