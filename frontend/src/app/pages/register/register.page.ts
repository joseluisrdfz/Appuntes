import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { GradosService } from 'src/app/services/grados.service';
import { UniversitiesService } from 'src/app/services/universities.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  state=0;

  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('passwordRepeat')?.value
    return pass === confirmPass ? null : { notSame: true }
  }

  registerForm : FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    passwordRepeat: [''],
    username: ['', [Validators.required]],
    profilePic:[undefined]
  }, {validators: this.checkPasswords});

  profilePicFile : File | undefined =  undefined;

  document = document;

  universidad = '';
  universidadId = '';

  grado = '';
  gradoId='';
  cursos='';

  pickerUniColumns:any;

  public pickerUniButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Confirmar',
      handler: (value:any) => {
        this.universidad = value['Universidades']['text'];
        this.universidadId = value['Universidades']['value'];
        this.getGrados();
        //llamar a la funcion para recuperar los grados.
      },
    },
  ];

  pickerGradoColumns: any;

  public pickerGradoButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Confirmar',
      handler: (value:any) => {
        this.grado = value['Grados']['text'];
        this.gradoId = value['Grados']['value'];
        this.cursos = value['Grados']['cursos']

        //llamar a la funcion para recuperar los grados.
      },
    },
  ];

  constructor(private router: Router, private formBuilder : FormBuilder , private uniService : UniversitiesService, private gradoService : GradosService ) {
    uniService.getUniversities().subscribe((res) => {
      let aux : Array<any> = [];

      res['universidades'].forEach((uni : any) => {

      aux.push({text : uni.name , value : uni.id_uni })

    });

    this.pickerUniColumns = [{
      name: 'Universidades',
      options: aux,
    },]

    })
  }

  ngOnInit() {


  }

  changeState(value : number){
    this.state += value;
  }

  goTo(route :any){
    this.router.navigateByUrl(route, { replaceUrl:true });
  }

  changeProfilePic(event: any){
    //console.log(event.target.files[0]);

    this.profilePicFile=event.target.files[0];

    const imgPP = document.getElementById('profilePic') as HTMLImageElement;
    if(this.profilePicFile)
    imgPP.src = URL.createObjectURL(this.profilePicFile);
  }

  getGrados(){
    this.gradoService.getGradosByUni(this.universidadId).subscribe((res) => {
      let aux : Array<any> = [];

      console.log(res)

      res['grados'].forEach((grado : any) => {

      aux.push({text : grado.grado_name , value : grado.id_grado, cursos : grado.cursos })

    });

    this.pickerGradoColumns = [{
      name: 'Grados',
      options: aux,
    },]

    })
  }

}
