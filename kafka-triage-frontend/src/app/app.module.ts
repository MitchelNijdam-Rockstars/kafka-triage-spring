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
import { BASE_PATH_KAFKA_TRIAGE_BACKEND } from "./errors/error-record.service";
import { environment } from "../environments/environment";
import { ToastComponent } from "./toast/toast.component";
import { NgbToastModule } from "@ng-bootstrap/ng-bootstrap";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTabsModule } from "@angular/material/tabs";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatPaginatorModule } from "@angular/material/paginator";
import { FilterBarComponent } from './filter/filter-bar/filter-bar.component';
import { FilterOptionComponent } from './filter/filter-option/filter-option.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    TopicsViewComponent,
    ErrorsViewComponent,
    ToastComponent,
    FilterBarComponent,
    FilterOptionComponent
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
    MatSidenavModule,
    MatSortModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatPaginatorModule
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
