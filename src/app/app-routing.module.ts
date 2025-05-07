import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { AppComponent } from './app.component';

// Single route for the main page where all components are displayed together
const routes: Routes = [
  { path: '', component: AppComponent, pathMatch: 'full' }, // Direkt zur Hauptseite ohne Umleitung
  { path: '**', redirectTo: '' } // Wildcard auf Root-Pfad umleiten
];

// Configure router options with smooth scrolling
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
  scrollOffset: [0, 70], // Offset for fixed navbar
  onSameUrlNavigation: 'reload',
  useHash: false // Keine Hash-Navigation verwenden
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
