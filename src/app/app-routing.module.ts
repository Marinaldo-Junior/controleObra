import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule', canActivate: [LoginGuard] },
  { path: 'work-list', loadChildren: './pages/work-list/work-list.module#WorkListPageModule', canActivate: [AuthGuard] },
  { path: 'work', loadChildren: './pages/work/work.module#WorkPageModule', canActivate: [AuthGuard] },
  { path: 'work-detail', loadChildren: './pages/work-detail/work-detail.module#WorkDetailPageModule', canActivate: [AuthGuard] },
  { path: 'team', loadChildren: './pages/team/team.module#TeamPageModule', canActivate: [AuthGuard] },
  { path: 'contractor', loadChildren: './pages/contractor/contractor.module#ContractorPageModule', canActivate: [AuthGuard] },
  { path: 'daily', loadChildren: './pages/daily/daily.module#DailyPageModule', canActivate: [AuthGuard] },
  { path: 'profile', loadChildren: './pages/profile/profile.module#ProfilePageModule', canActivate: [AuthGuard] },
  { path: 'profile-list', loadChildren: './pages/profile-list/profile-list.module#ProfileListPageModule', canActivate: [AuthGuard] },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [AuthGuard]},
  { path: 'equipment', loadChildren: './pages/equipment/equipment.module#EquipmentPageModule', canActivate: [AuthGuard] },
  { path: 'equipment/:id', loadChildren: './pages/equipment/equipment.module#EquipmentPageModule', canActivate: [AuthGuard] },
  { path: 'equipment-list', loadChildren: './pages/equipment-list/equipment-list.module#EquipmentListPageModule', canActivate: [AuthGuard] },
  { path: 'worker', loadChildren: './pages/worker/worker.module#WorkerPageModule', canActivate: [AuthGuard] },
  { path: 'worker-list', loadChildren: './pages/worker-list/worker-list.module#WorkerListPageModule', canActivate: [AuthGuard] },
  { path: 'contractor-list', loadChildren: './pages/contractor-list/contractor-list.module#ContractorListPageModule',  canActivate: [AuthGuard]  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },   { path: 'checkbox-modal', loadChildren: './shared/modals/checkbox-modal/checkbox-modal.module#CheckboxModalPageModule' },

];

/* o "useHash" permite que servidores externo possam interagir sem problemas com nossa aplicação */

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
