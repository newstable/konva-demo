import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatCardModule, MatButtonToggleModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  declarations: []
})
export class MaterialModule { }
