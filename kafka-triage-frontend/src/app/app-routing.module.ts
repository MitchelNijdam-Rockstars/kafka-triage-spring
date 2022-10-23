import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { TopicsViewComponent } from "./topics/topics-view/topics-view.component";
import { ErrorsViewComponent } from "./errors/errors-view/errors-view.component";

const routes: Routes = [
  { path: '', redirectTo: 'topics', pathMatch: 'full' },
  { path: 'topics', component: TopicsViewComponent },
  { path: 'errors', component: ErrorsViewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
