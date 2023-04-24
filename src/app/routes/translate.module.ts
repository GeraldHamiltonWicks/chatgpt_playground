import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { TranslatePageComponent } from "../pages/translate/translate.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: TranslatePageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), TranslatePageComponent],
})
export class TranslateRoutingModule {};