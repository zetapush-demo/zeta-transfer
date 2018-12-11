import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadComponent } from './upload/upload.component';
import { DownloadComponent } from './download/download.component';

@NgModule({
	imports: [
		BrowserModule,
		AppRoutingModule,
		MatProgressSpinnerModule
	],
	declarations: [
		AppComponent,
		UploadComponent,
		DownloadComponent
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
