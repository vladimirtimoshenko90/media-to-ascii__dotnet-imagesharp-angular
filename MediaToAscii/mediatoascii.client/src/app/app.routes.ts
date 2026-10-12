import { Routes } from '@angular/router';
import { ConvertPage } from './pages/convert-page';

export const routes: Routes = [
  { path: '', component: ConvertPage },
  { path: '**', redirectTo: '' },
];
