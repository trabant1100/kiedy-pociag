import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TrainStationPipe } from './train-station.pipe';
import { TrainDetailComponent } from './train-detail/train-detail.component';

const appRoutes: Routes = [
  { path: 'train-detail/:id/:stationCode', component: TrainDetailComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    TrainStationPipe,
    TrainDetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    NgbTimepickerModule,
    RouterModule.forRoot(appRoutes, { enableTracing: false})
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [TrainDetailComponent]
})
export class AppModule { }
