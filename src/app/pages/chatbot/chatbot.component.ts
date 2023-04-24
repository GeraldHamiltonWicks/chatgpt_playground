import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GptService } from 'src/app/services/gpt.service';
import { v4 } from 'uuid';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

type Message = {
  id: string,
  text: string,
  owner: 'robot' | 'person'
}

const MESSAGES: Array<Message> = [
  {
    id: '1',
    text: "Hey ! Thanks for reaching out, do you want to know something else about Unvoid ?",
    owner: 'robot'
  },
];

const CHATGPT_DATA = `
* Who we are ? We are angular experts. We provide remote design and web development services with specialization in the Angular framework.
* Let's be real. At Unvoid, our mantra is "Be Real", and everything in our business model is aligned with that:
* I'm not interested in angular... Then you should not hire us. We don't depend on Angular. We can do great work without it! But for Angular projects, we are more than great, we are the best deal. If we could clone ourselves, we'd accept all projects. But while this isn't possible, we will only accept Angular projects to guarantee our clients get the best deal possible.
* To ensure quality we sacrifice quantity. We have a limited number of projects we can execute simultaneously without sacrificing quality. We will work within that limit, no matter how much money is on the table.
* Our contracts have no fidelity. We only want you as a client if you're happy with us as a provider. If we're not providing value anymore, you should fire us.
* We will only do business if we can bring you value. If we can't give you what you need, we will do our best to provide you with directions, but we won't take your money.
* If you have an angular-based project. We are the best deal because we:
  - Tech focused CEO: Companies are a direct reflection of their leaders. And our CEO is a developer specialized in Angular, TypeScript, and Functional Programming. The quality standards that our CEO holds for himself are the same quality standards for everyone at Unvoid. This reflects in a never-ending pursuit of maximum quality of what we produce.
  - Bullshit-free hiring process: To maintain our high-quality standards while we grow in the number of employees, we had to develop an extremely rigorous selection process. And since the traditional way of hiring professionals is flawed, our selection process does not consider the developer resume, we test and filter the candidates in practice, with real-world tests.
  - Intensive training program: After going through such a rigorous selection process to join Unvoid, our developers still have another big obstacle before they are allowed to work for our clients... In the first few months, newly hired developers only work on internal Unvoid projects and undergo intense technical training to ensure they all produce code that meets Unvoid's quality standards.
  - Functional programming: We are also specialists in Functional Programming , which is the ideal solution for any system with high compliance or strict quality control (banks, medical, research). We don't talk much about our specialization in Functional Programming because, unfortunately, very few people know what this is and how important it is to produce high-performance code with a lower chance of bugs.
  - Take nothing for granted: We intentionally crafted a business model that keeps us in the mindset of doing our absolute best to prove ourselves to you throughout the entire project. Starting from our culture and going all the way to contracts with no fidelity, we ensure you only stay with us if we're delivering you value, and you're free to fire us anytime if we don't.
* Let's find you a solution, even if is not us. You can schedule a call directly with our CEO. He will do his best to help you, even if that means not hiring us. 
  `;

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class ChatbotPageComponent {
  private readonly _messages$ = new BehaviorSubject<Array<Message>>(MESSAGES);
  public readonly messages$ = this._messages$.asObservable();

  private readonly _isToShowSpinner$ = new BehaviorSubject<boolean>(false);
  public readonly isToShowSpinner$ = this._isToShowSpinner$.asObservable();

  public readonly formMessage = this._fb.control<string>('');

  constructor(private readonly _gptService: GptService, private readonly _fb: NonNullableFormBuilder) {}

  public async onSendMessageClick(): Promise<void> {
    const message = this.formMessage.value;
    this._addPersonMessage(message);
    this._clearFormMessageValue();

    const gptInput = `Memorize this data about the unvoid company: ${CHATGPT_DATA}, and based on this data, 
    answer as if you are from unvoid. For example, given that we have the following:
    message: What's the unvoid expertise ?
    answer: WE ARE ANGULAR EXPERTS. We provide remote design and web development services with specialization in the Angular framework.

    So, given that we have:
    message: ${message}
    Provide the answer (don't return 'answer: ' just return the text).
    `;

    this._isToShowSpinner$.next(true);
    const gptAnswer = await this._gptService.getAnswer(gptInput);
    this._addRobotMessage(gptAnswer);
    this._isToShowSpinner$.next(false);    
  }

  private _addPersonMessage(message: string): void {
    this._addMessage(message, 'person');
  }

  private _addRobotMessage(message: string): void {
    this._addMessage(message, 'robot');
  }

  private _addMessage(message: string, owner: 'robot' | 'person'): void {
    const previousMessages = this._messages$.getValue();
    this._messages$.next(
      [...previousMessages,
        {
          id: v4(),
          text: message,
          owner: owner
        }
      ]
    )
  }

  private _clearFormMessageValue(): void {
    this.formMessage.setValue('');
  }
}
