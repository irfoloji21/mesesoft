import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleObj } from '../classes/solution';

@Injectable({
  providedIn: 'root'
})
export class GoogletranslateService {
  url = 'https://translation.googleapis.com/v3beta1/projects/YOUR_PROJECT_ID:translateText';
  key = '';

  constructor(private http: HttpClient) { }

  translate(obj: GoogleObj) {
    return this.http.post(this.url + this.key, obj);
  }


}
