import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { UsersService } from '../services/users.service';

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

  anuncios : any[] = [];

  constructor(private userService : UsersService) {}

  ngOnInit() {
    this.userService.getHomeInfo().subscribe((res:any)=>{
      console.log(res)
      this.anuncios = res.anuncios;
      this.nameUser = res.userinfo.name;
      this.nameGrado = res.userinfo.grado_name;
      this.profilePic = res.userinfo.profilePic;
    })
  }

}
