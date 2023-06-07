import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public alertButtons = ['OK'];

  isModalOpen = false;

  loginError = "No se ha podido iniciar sesión";

  loginForm : FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
 });

  constructor(private router: Router, public formBuilder: FormBuilder, private authService : AuthenticationService) { }

  ngOnInit() {
  }


  login(){

    if(this.loginForm.valid){

      this.authService.login(this.loginForm.value).subscribe((res) => {
        console.log(res);
        if(res.ok){
          //successfull
          localStorage.setItem('x-token', res.token);
          this.router.navigateByUrl('/tabs/tabs/tab1', { replaceUrl:true });
        }
      }, (e) =>{
        console.log(e)
        this.isModalOpen = true;
        this.loginError = 'El nombre de usuario o la contraseña no son correctos.'
      })

    } else {
      this.isModalOpen = true;
      this.loginError = 'El nombre de usuario y contraseña son obligatorios'
    }
  }


  goTo(route :any){
    this.router.navigateByUrl(route, { replaceUrl:true });
  }

  openModal(value : boolean){
    this.isModalOpen = value;
  }

}
