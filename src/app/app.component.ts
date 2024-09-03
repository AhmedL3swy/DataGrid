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
      { name: 'Ahmed1', age: 16 },
      { name: 'Ahmed2', age: 16 },
      { name: 'Ahmed3', age: 16 },
      { name: 'Ahmed4', age: 16 },
      { name: 'Ahmed5', age: 16 },
      { name: 'Ahmed6', age: 16 },
      { name: 'Ahmed7', age: 16 },
      { name: 'Ahmed8', age: 16 },
      { name: 'Ahmed9', age: 16 },
      { name: 'Ahmed10', age: 16 },
      { name: 'Ahmed11', age: 16 },
      { name: 'Ahmed12', age: 16 },
      { name: 'XD', age: 16 },
    ],
  };
}
