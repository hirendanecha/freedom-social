import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Community } from '../constant/customer';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private baseUrl = environment.serverUrl + 'community';

  constructor(private http: HttpClient) {}

  getCommunity(): Observable<Community> {
    return this.http.get<Community>(`${this.baseUrl}/`);
  }

  createCommunity(communityData: Community): Observable<Community> {
    return this.http.post<Community>(`${this.baseUrl}/create`, communityData);
  }

  getLogoImg(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/community-logo/${id}`);
  }

  getCoverImg(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/community-cover/${id}`);
  }
  
  changeAccountType(id): Observable<any> {
    const type = 'communityAdmin'
    return this.http.get(`${this.baseUrl}/change-user-type/${id}/?type=${type}`);
  }
}
