import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { environment } from 'src/environments/environment';
import { UploadComponent } from './upload/upload.component';
import { DownloadComponent } from './download/download.component';

const routes: Routes = [
	{ path: '',		component: UploadComponent },
	{ path: ':token',	component: DownloadComponent },
	{ path: '**',		redirectTo: '/'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: environment.useHash })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
