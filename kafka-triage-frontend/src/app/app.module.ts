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
import { ToastComponent } from "./toast/toast.component";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    TopicsViewComponent,
    ErrorsViewComponent,
    ToastComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    AppRoutingModule,
    MatTableModule,
    HttpClientModule,
    NgbToastModule,
    MatToolbarModule,
    MatSidenavModule
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
