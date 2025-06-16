import { Routes } from '@angular/router';
import { TranslationsComponent } from './feature/translations/translations.component';

export const routes: Routes = [
  { path: '', redirectTo: 'translations', pathMatch: 'full' },
  { path: 'translations', component: TranslationsComponent }
];
