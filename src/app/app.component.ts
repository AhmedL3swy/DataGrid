import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataGridComponent } from './Components/data-grid/data-grid.component';
import { DataGridConfig } from './types/data-grid-config';
import { json } from 'stream/consumers';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'DataGrid';

  
}
