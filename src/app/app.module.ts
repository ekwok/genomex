import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { DataService } from './data.service';
import { HomeComponent } from './home/home.component';
import { ResultsComponent } from './results/results.component';
import { GeneticComponent } from './genetic/genetic.component';
import { WellnessComponent } from './wellness/wellness.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'results',
    component: ResultsComponent,
    children: [
      { path: 'genetic', component: GeneticComponent },
      { path: 'wellness', component: WellnessComponent }
    ]
  }
];

@NgModule({
  imports:      [ BrowserModule, FormsModule, RouterModule.forRoot(routes), HttpClientModule ],
  declarations: [ AppComponent, HelloComponent, HomeComponent, ResultsComponent, GeneticComponent, WellnessComponent ],
  bootstrap:    [ AppComponent ],
  providers: [ DataService ]
})
export class AppModule { }
