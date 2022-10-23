import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { RouterModule } from "@angular/router";
import { TopicsViewComponent } from './topics/topics-view/topics-view.component';
import { AppRoutingModule } from './app-routing.module';
import { ErrorsViewComponent } from './errors/errors-view/errors-view.component';
import { MatTableModule } from "@angular/material/table";
import { HttpClientModule } from "@angular/common/http";
import { BASE_PATH_KAFKA_TRIAGE_BACKEND } from "./errors/error.service";
import { environment } from "../environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    TopicsViewComponent,
    ErrorsViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    AppRoutingModule,
    MatTableModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: BASE_PATH_KAFKA_TRIAGE_BACKEND,
      useValue: environment.basePathKafkaTriageBackend,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
