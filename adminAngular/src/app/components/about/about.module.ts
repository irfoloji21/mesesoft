import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AboutRoutingModule } from './about-routing.module';
import { ListAboutComponent } from './list-about/list-about.component';
import { CreateAboutComponent } from './create-about/create-about.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ListAboutComponent, CreateAboutComponent],
  imports: [
    CommonModule,
    AboutRoutingModule,
    NgbModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AboutModule { }
