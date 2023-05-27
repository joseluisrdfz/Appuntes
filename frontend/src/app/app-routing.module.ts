import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';
import { IntroGuard } from './guards/intro.guard';

const routes: Routes = [
  {
		path: 'login',
		loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
		canLoad: [AutoLoginGuard] // Guards que comprueban si se muestra la pagina de introduccion o si se inicia sesion automaticamente
	},
	{
		path: 'intro',
		loadChildren: () => import('./pages/intro/intro.module').then((m) => m.IntroPageModule),
		canLoad: [IntroGuard] // la usare para comprobar si hay un token, si lo hay manda directamente al login y el login tendra los datos
	},
	{
		path: 'tabs',
		loadChildren: () => import('./tabs/tabs.module').then((m) => m.TabsPageModule),
		canLoad: [AuthGuard] // Este auth asegura todas las paginas hijas del tabs
	},{
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },{
		path: '**',
		redirectTo: '/intro',

	}
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
