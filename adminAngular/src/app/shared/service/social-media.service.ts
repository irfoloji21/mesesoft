import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {
  private socialMediaUrl = 'http://localhost:3000/social-media';

  constructor(private http: HttpClient) { }

  getSocialMedia(): Observable<any[]> { 
    return this.http.get<any[]>(this.socialMediaUrl);
  }

  AddsocialMedia(socialMedia: any): Observable<any[]> {
    return this.http.post<any[]>(this.socialMediaUrl, socialMedia).pipe(
      switchMap(() => this.getSocialMedia())
    );
  }
}
