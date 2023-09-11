import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'tab3',
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'tab4',
        loadChildren: () => import('../tab4/tab4.module').then(m => m.Tab4PageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'tab5',
        loadChildren: () => import('../tab5/tab5.module').then(m => m.Tab5PageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'apuntes/:id',
        loadChildren: () => import('../pages/elements/apuntes/apuntes.module').then((m) => m.ApuntesPageModule),
        canLoad: [AuthGuard]
      },{
        path: 'preguntas/:id',
        loadChildren: () => import('../pages/elements/preguntas/preguntas.module').then((m) => m.PreguntasPageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'user/:id',
        loadChildren: () => import('../pages/elements/user/user.module').then( m => m.UserPageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'asignatura/:id',
        loadChildren: () => import('../pages/elements/asignatura/asignatura.module').then( m => m.AsignaturaPageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'grado/:id',
        loadChildren: () => import('../pages/elements/grado/grado.module').then( m => m.GradoPageModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'uni/:id',
        loadChildren: () => import('../pages/elements/uni/uni.module').then( m => m.UniPageModule),
        canLoad: [AuthGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/tabs/tab3'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
