import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadComponent } from './upload/upload.component';
import { DownloadComponent } from './download/download.component';

const routes: Routes = [
	{ path: '',		component: UploadComponent },
	{ path: ':token',	component: DownloadComponent },
	{ path: '**',		redirectTo: '/'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
