import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { ChatbotPageComponent } from "../pages/chatbot/chatbot.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: ChatbotPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), ChatbotPageComponent],
})
export class ChatbotRoutingModule {};