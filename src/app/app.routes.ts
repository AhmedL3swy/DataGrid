import { Routes } from '@angular/router';
import { EmptyComponent } from './Components/empty/empty.component';
import { GridComponent } from './Components/grid/grid.component';

export const routes: Routes = [
    { path: 'empty', component: EmptyComponent },
    { path: 'grid', component: GridComponent },
    { path: '**', component: GridComponent },
];
