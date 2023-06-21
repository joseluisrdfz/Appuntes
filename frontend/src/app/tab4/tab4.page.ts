import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GradosService } from '../services/grados.service';
import { UniversitiesService } from '../services/universities.service';
import { UsersService } from '../services/users.service';
import { AuthenticationService } from '../services/authentication.service';
import { AsignaturaService } from '../services/asignatura.service';
import { ApuntesService } from '../services/apuntes.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})

export class Tab4Page implements OnInit {
  document : Document = document;
  nombreArchivo='Archivo no seleccionado';
  apuntesFile : File | undefined = undefined;

  subirError = 'Ha ocurrido un error';

  isModalOpen = false;

  apuntesForm : FormGroup = this.formBuilder.group({
    titlename: ['', [Validators.required]],
    description: ['', [Validators.required]],
    asignatura:['',[Validators.required]]
  }, );

  public alertButtons = ['OK'];

  userInfo : any = undefined;

  universidadId = '';

  grado = '';
  gradoId='';
  cursos='';

  cursouser='';
  curso='';

  asignatura='';
  asignaturaId='';

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
        //this.apuntesForm.get('grado')?.setValue(this.gradoId)

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
        this.getAsignaturas();
      },
    },
  ];

  pickerAsigColumns:any;


  public pickerAsigButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      cssClass: 'pickerButton'
    },
    {
      text: 'Confirmar',
      cssClass: 'pickerButton',
      handler: (value:any) => {
      this.asignaturaId = value['Asignatura']['value'];
      this.asignatura= value['Asignatura']['text'];
      this.apuntesForm.get('asignatura')?.setValue(this.asignaturaId)
      },
    },
  ];



  constructor(private router: Router, private formBuilder : FormBuilder, private gradoService : GradosService, private asigService : AsignaturaService ,private usersService: UsersService , private apuntesService : ApuntesService) {

    usersService.getUserMyInfo().subscribe((res:any)=>{
      this.universidadId = res['userinfo'][0]['uni'];
      this.gradoId = res['userinfo'][0]['grado'];
      this.cursouser = res['userinfo'][0]['curso'];
      this.gradoService.getGradosByUni(this.universidadId).subscribe((res:any) => {
        let aux : Array<any> = [];
        let selectedGrado = 0;
        res['grados'].forEach((grado : any, index : number) => {
        if(this.gradoId === grado.id_grado ){
          selectedGrado = index;
        }
        aux.push({text : grado.grado_name , value : grado.id_grado, cursos : grado.cursos })

      });

      this.pickerGradoColumns = [{
        name: 'Grados',
        options: aux,
        selectedIndex : selectedGrado
      },]

      })
    })

  }

  ngOnInit() {
  }

  changeApuntes(event:any){
    //console.log(event);

    this.apuntesFile=event.target.files[0];
    if(this.apuntesFile?.name)
    this.nombreArchivo = this.apuntesFile?.name
  }

  getCursos(){

    let aux : Array<any> = [];

    for(let i = 0; i<Number(this.cursos) ; i++){
      aux.push({text : i+1 , value : i+1 })
    }

    this.pickerCursosColumns = [{
      name: 'Cursos',
      options: aux,
      selectedIndex : this.cursouser
    },]

  }

  getAsignaturas(){
    this.asigService.getAsiganturasGradoCurso(this.gradoId, this.curso).subscribe((res:any) => {
      //console.log(res)

      let aux : Array<any> = [];

      res['resultado'].forEach((asignatura : any) => {

      aux.push({text : asignatura.name , value : asignatura.id_asignatura })

    });

    this.pickerAsigColumns = [{
      name: 'Asignatura',
      options: aux,
    },]

    })
  }

  openModal(value : boolean){
    this.isModalOpen = value;
  }

  subirApuntes(){
    if(this.apuntesForm.valid && this.apuntesFile!= undefined){
      let formData = this.apuntesForm.value;
      try{


        formData['filename'] = this.apuntesFile.name;

        var reader = new FileReader();


        reader.onloadend = () =>{
          formData['file'] = reader.result;
          this.apuntesService.postApuntes(formData).subscribe((res:any)=>{
            console.log(res);
            if(!res.ok){
              this.subirError = res.message;
            this.openModal(true);
            }

          })
        }
        console.log(this.apuntesFile);
        reader.readAsDataURL(this.apuntesFile as Blob);

      }

      catch (e){
        this.subirError = "Ha habido un error en la subida";
        this.openModal(true);
      }

    } else {
      this.subirError = "Todos los campos son obligatorios";
      this.apuntesForm.markAllAsTouched();
      this.openModal(true);
    }
  }
}
