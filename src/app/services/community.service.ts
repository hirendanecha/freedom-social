import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Community } from '../constant/customer';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private baseUrl = environment.serverUrl + 'community';

  constructor(private http: HttpClient) {}

  upload(file: File, id: any, defaultType: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('folder', defaultType);
    formData.append('file', file);
    formData.append('id', id);
    formData.append('default', defaultType);

    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}/upload-community`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  getCommunity(id): Observable<Community> {
    return this.http.get<Community>(`${this.baseUrl}/?id=${id}`);
  }

  createCommunity(communityData: Community): Observable<Community> {
    return this.http.post<Community>(`${this.baseUrl}/create`, communityData);
  }

  joinCommunity(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/join-community`, data);
  }
  createCommunityAdmin(data): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/create-community-admin`, data);
  }

  getLogoImg(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/community-logo/${id}`);
  }

  getCoverImg(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/files/community-cover/${id}`);
  }

  changeAccountType(id): Observable<any> {
    const type = 'communityAdmin';
    return this.http.get(
      `${this.baseUrl}/change-user-type/${id}/?type=${type}`
    );
  }

  getCommunityByUserId(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${id}`);
  }

  getJoinedCommunityByProfileId(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/joined-community/${id}`);
  }

  getCommunityById(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getCommunityByName(name): Observable<any> {
    return this.http.get(`${this.baseUrl}/${name}`);
  }

  deleteCommunity(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  removeFromCommunity(id, profileId): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/leave?communityId=${id}&profileId=${profileId}`
    );
  }
}
