import { NgModule } from '@angular/core';
import type { Route, Routes } from '@angular/router';
import { PreloadAllModules, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Chatbot',
    loadChildren: () => import('./routes/chatbot-routing.module').then(routing => routing.ChatbotRoutingModule)
  },
  {
    path: 'translate',
    pathMatch: 'full',
    title: 'Translate',
    loadChildren: () => import('./routes/translate.module').then(routing => routing.TranslateRoutingModule)
  }
];

@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
})
export class AppRoutingModule {}

