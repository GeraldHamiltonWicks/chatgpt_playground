import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { GptService } from 'src/app/services/gpt.service';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { isEmpty } from 'lodash-es';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss'],
  imports: [CommonModule, MatSelectModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  standalone: true
})
export class TranslatePageComponent {
  public readonly languages = [
    'afrikaans', 'albanian', 'amharic', 'arabic', 'armenian', 'azerbaijani', 'basque', 'belarusian', 'bengali', 'bosnian', 'bulgarian', 'catalan', 'cebuano', 'chichewa', 'chinese (simplified)', 'chinese (traditional)', 'corsican', 'croatian', 'czech', 'danish', 'dutch', 'english', 'esperanto', 'estonian', 'filipino', 'finnish', 'french', 'frisian', 'galician', 'georgian', 'german', 'greek', 'gujarati', 'haitian creole', 'hausa', 'hawaiian', 'hebrew', 'hindi', 'hmong', 'hungarian', 'icelandic', 'igbo', 'indonesian', 'irish', 'italian', 'japanese', 'javanese', 'kannada', 'kazakh', 'khmer', 'kinyarwanda', 'korean', 'kurdish (kurmanji)', 'kyrgyz', 'lao', 'latin', 'latvian', 'lithuanian', 'luxembourgish', 'macedonian', 'malagasy', 'malay', 'malayalam', 'maltese', 'maori', 'marathi', 'mongolian', 'myanmar (burmese)', 'nepali', 'norwegian', 'odia (oriya)', 'pashto', 'persian', 'polish', 'portuguese', 'punjabi', 'romanian', 'russian', 'samoan', 'scots gaelic', 'serbian', 'sesotho', 'shona', 'sindhi', 'sinhala', 'slovak', 'slovenian', 'somali', 'spanish', 'sundanese', 'swahili', 'swedish', 'tajik', 'tamil', 'tatar', 'telugu', 'thai', 'turkish', 'turkmen', 'ukrainian', 'urdu', 'uyghur', 'uzbek', 'vietnamese', 'welsh', 'xhosa', 'yiddish', 'yoruba', 'zulu'
  ];

  public readonly form = this._fb.group({
    languageToTranslate: this._fb.control<string>(''),
    translatedLanguage: this._fb.control<string>('')
  });

  private readonly _translation$ = new BehaviorSubject<string>('');
  public readonly translation$ = this._translation$.asObservable();

  private readonly _isToShowError$ = new BehaviorSubject<boolean>(false);
  public readonly isToShowError$ = this._isToShowError$.asObservable();

  private readonly _isToShowSpinner$ = new BehaviorSubject<boolean>(false);
  public readonly isToShowSpinner$ = this._isToShowSpinner$.asObservable();

  constructor(private readonly _gptService: GptService, private readonly _fb: NonNullableFormBuilder) {}

  public async translate(words: string): Promise<void> {
    if (this.isLanguageFieldsEmpty || isEmpty(words)) {
      this._isToShowError$.next(true);
    }
    else {
      const languageToTranslate = this.form.controls.languageToTranslate.value;
      const translatedLanguage = this.form.controls.translatedLanguage.value;
      const gptInput = `Translate ${words} from ${languageToTranslate} to ${translatedLanguage}.`;
  
      this._isToShowSpinner$.next(true);
      const gptAnswer = await this._gptService.getAnswer(gptInput);
      const formattedAnswer = this.removeWhiteSpaces(gptAnswer);

      this._translation$.next(formattedAnswer);
      this._isToShowError$.next(false);
      this._isToShowSpinner$.next(false);
    }
  }

  private removeWhiteSpaces(text: string): string {
    return text.replace(/\r?\n|\r/g, '')
  }

  public get isLanguageFieldsEmpty(): boolean {
    const languageToTranslate = this.form.controls.languageToTranslate.value;
    const translatedLanguage = this.form.controls.translatedLanguage.value; 
    return isEmpty(languageToTranslate) || isEmpty(translatedLanguage);
  }
}
