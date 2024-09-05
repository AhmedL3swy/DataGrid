import { Routes } from '@angular/router';
import { EmptyComponent } from './Components/empty/empty.component';
import { GridContainerComponent } from './Components/gridContainer/grid.component';

export const routes: Routes = [
  { path: 'empty', component: EmptyComponent },
  { path: 'grid', component: GridContainerComponent },
  { path: '**', component: GridContainerComponent },
];
