import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AboutUsData } from '../classes/about-us';

@Injectable({
  providedIn: 'root'
})
export class AboutUsService {

  private apiUrl = 'assets/data/aboutUs.json'; // JSON dosyasının yolu
    
  constructor(private http: HttpClient) { }

  getAboutUsData(): Observable<AboutUsData> {
    return this.http.get<AboutUsData>(this.apiUrl);
  }
}
