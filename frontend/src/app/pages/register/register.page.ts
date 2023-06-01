import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  state=0;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  changeState(value : number){
    this.state += value;
  }

  goTo(route :any){
    this.router.navigateByUrl(route, { replaceUrl:true });
  }

}
