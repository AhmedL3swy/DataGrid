import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataGridComponent } from './Components/data-grid/data-grid.component';
import { DataGridConfig } from './types/data-grid-config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DataGridComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'DataGrid';

  dataGird: DataGridConfig = {
    columns: [
      { name: 'Name', field: 'name', sortable: true },
      { name: 'Age', field: 'age', sortable: false },
    ],
    data: [
      { name: 'Ahmed', age: 16 },
      { name: 'bAxhmed', age: 17 },
      { name: 'xAhmed', age: 15 },
      { name: 'rAhmed', age: 11 },
      { name: 'yAhmed', age: 14 },
      { name: 'zAhmed', age: 16 },
      { name: 'hAhmed7', age: 17 },
      { name: 'nAhmed8', age: 14 },
      { name: 'tAhmed9', age: 181 },
      { name: 'fAhmed10', age: 14 },
      { name: 'wAhmed11', age: 12 },
      { name: 'wAhmed12', age: 14 },
      { name: 'wXD', age: 16 },
    ],
  };
}
