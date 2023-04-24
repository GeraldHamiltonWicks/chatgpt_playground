import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';

@Injectable({
  providedIn: 'root'
})
export class GptService {
  constructor() {}

  public async getAnswer(message: string): Promise<string> {
    const configuration = new Configuration({
      apiKey: ''
    });
    const api = new OpenAIApi(configuration);

    const response = await api.createCompletion({
      model: 'text-davinci-003',
      prompt: `answer to the message: ${message}`,
      temperature: 0,
      max_tokens: 2048
    });

    try {
      const answer = response.data.choices[0].text as string;
      return answer;
    }
    catch(error) {
      console.warn(error);
      return 'Unable to answer, please try again later';
    }
  } 
}
