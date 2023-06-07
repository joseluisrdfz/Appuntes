import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { GradosService } from 'src/app/services/grados.service';
import { UniversitiesService } from 'src/app/services/universities.service';
import { from } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  isModalOpen = false;

  registerError = "No se ha podido registrar al usuario";

  public alertButtons = ['OK'];

  imgsrc = '../../../assets/uploads/profilePics/default.webp';

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
    password: ['', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])([A-Za-z0-9]){9,}$')]],
    passwordRepeat: [''],
    username: ['', [Validators.required]],
    curso:['',[Validators.required]],
    uni:['',[Validators.required]],
    grado:['',[Validators.required]],
    termsCheck:[false, [Validators.requiredTrue]]
  }, {validators: this.checkPasswords});

  profilePicFile : File | undefined =  undefined;

  document = document;

  universidad = '';
  universidadId = '';

  grado = '';
  gradoId='';
  cursos='';

  curso='';

  pickerUniColumns:any;



  public pickerUniButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      cssClass: 'pickerButton'
    },
    {
      text: 'Confirmar',
      cssClass: 'pickerButton',
      handler: (value:any) => {
        this.universidad = value['Universidades']['text'];
        this.universidadId = value['Universidades']['value'];
        this.getGrados();
        this.grado = '';
        this.gradoId='';
        this.cursos='';
        this.curso='';
        this.pickerCursosColumns = undefined;
        this.registerForm.get('uni')?.setValue(this.universidadId)
      },
    },
  ];

  pickerGradoColumns: any;

  public pickerGradoButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      cssClass: 'pickerButton',
    },
    {
      text: 'Confirmar',
      cssClass: 'pickerButton',
      handler: (value:any) => {

        this.grado = value['Grados']['text'];
        this.gradoId = value['Grados']['value'];
        this.cursos = this.pickerGradoColumns[0]['options'][value['Grados']['columnIndex']].cursos
        this.curso = '';
        this.getCursos();
        this.registerForm.get('grado')?.setValue(this.gradoId)

      },
    }
  ];

  pickerCursosColumns: any;

  public pickerCursosButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      cssClass: 'pickerButton',
    },
    {
      text: 'Confirmar',
      cssClass: 'pickerButton',
      handler: (value:any) => {
        this.curso = value['Cursos']['value'];
        this.registerForm.get('curso')?.setValue(this.curso)
      },
    },
  ];


  constructor(private router: Router, private formBuilder : FormBuilder , private uniService : UniversitiesService, private gradoService : GradosService, private usersService: UsersService ) {
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

  changeState(value : number, type: string){
    if(type === 'set'){
      this.state = value;
    } else if(type === 'add'){
      this.state += value;
    }

  }

  goTo(route :any){
    this.router.navigateByUrl(route, { replaceUrl:true });
  }

  changeProfilePic(event: any){
    //console.log(event.target.files[0]);

    this.profilePicFile=event.target.files[0];

    //const imgPP = document.getElementById('profilePic') as HTMLImageElement;
    if(this.profilePicFile)
    this.imgsrc = URL.createObjectURL(this.profilePicFile);
    //imgPP.src = URL.createObjectURL(this.profilePicFile);
  }

  getGrados(){
    this.gradoService.getGradosByUni(this.universidadId).subscribe((res) => {
      let aux : Array<any> = [];


      res['grados'].forEach((grado : any) => {

      aux.push({text : grado.grado_name , value : grado.id_grado, cursos : grado.cursos })

    });

    this.pickerGradoColumns = [{
      name: 'Grados',
      options: aux,
    },]


    })
  }

  getCursos(){

    let aux : Array<any> = [];

    for(let i = 0; i<Number(this.cursos) ; i++){
      aux.push({text : i+1 , value : i+1 })
    }

    this.pickerCursosColumns = [{
      name: 'Cursos',
      options: aux,
    },]

  }

  openModal(value : boolean){
    this.isModalOpen = value;
  }

  registrar(){



    if(this.registerForm.valid){
      let formData = this.registerForm.value;
      try{

      if(this.profilePicFile!= undefined){
        formData['profilePicName'] = this.profilePicFile.name;

        var reader = new FileReader();


        reader.onloadend = () =>{
          formData['profilePicFile'] = reader.result;
          this.usersService.registerUser(formData).subscribe((res)=>{
            console.log(res);
            if(!res.ok){
              this.registerError = res.message;
            this.openModal(true);
            }

          })
        }


          console.log(this.profilePicFile);
          reader.readAsDataURL(this.profilePicFile as Blob);

      } else {
        this.usersService.registerUser(formData).subscribe((res)=>{
          console.log(res);
          if(!res.ok){
            this.registerError = res.message;
          this.openModal(true);
          }

        })
      }





      } catch (e){
        this.registerError = "Ha habido un error en el registro";
        this.openModal(true);
      }


    } else {
      this.registerError = "Te ha faltado un campo obligatorio por rellenar";
      this.registerForm.markAllAsTouched();
      if(this.curso=='' || this.universidadId=='' || this.gradoId==''){
        this.registerError = "Te ha faltado un campo obligatorio por rellenar, debes indicar tu universidad, grado y curso.";
      }
      this.openModal(true);
    }
  }

}
