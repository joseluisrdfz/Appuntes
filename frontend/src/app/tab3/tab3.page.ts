import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

register();

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  nameUser = "Jose Luis";
  nameGrado = "Grado en ingeniería multimedia";
  profilePic = 'default.webp';
  grado='';

  anuncios : any[] = [];

  constructor(private userService : UsersService,  private router : Router) {}

  ngOnInit() {
    this.userService.getHomeInfo().subscribe((res:any)=>{
      //console.log(res)
      this.anuncios = res.anuncios;
      this.nameUser = res.userinfo.name;
      this.nameGrado = res.userinfo.grado_name;
      this.profilePic = res.userinfo.profilePic;
      this.grado = res.userinfo.grado;
    })
  }

  goto(url:any){
    this.router.navigateByUrl('/tabs/tabs'+url,  {state: { prevUrl : "/tabs/tabs/tab3", changePrev : 'yes'}})
  }

  buscar(event:any){
   if(event.detail.value!==''){
    this.router.navigateByUrl('/tabs/tabs/tab1?query='+ event.detail.value ,  {state: { prevUrl : "/tabs/tabs/tab3", changePrev : 'yes', query2search: event.detail.value}})
    console.log(typeof event.srcElement)
    event.srcElement.value='';
   }
  }


}
