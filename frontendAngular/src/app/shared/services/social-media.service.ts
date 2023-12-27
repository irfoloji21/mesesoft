import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SocialMediaService {
  private socialMediaUrl = 'assets/data/social-media-links.json';

  constructor(private http: HttpClient) { }

  getSocialMediaLinks(): Observable<any> {
    return this.http.get<any>(this.socialMediaUrl);
  }
}
