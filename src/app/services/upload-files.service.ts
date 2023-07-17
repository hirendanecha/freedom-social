import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadFilesService {
  private baseUrl = environment.serverUrl + 'utils';
  private imgUrl = environment.imgUrl;

  constructor(private http: HttpClient) {}

  upload(file: File, id: any, defaultType: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('folder', defaultType);
    formData.append('file', file);
    formData.append('id', id);
    formData.append('default', defaultType);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  getProfilePic(): Observable<any> {
    let id = window.sessionStorage.user_id;
    return this.http.get(`${this.baseUrl}/files/profile/${id}`);
  }

  getCoverPic(): Observable<any> {
    let id = window.sessionStorage.user_id;
    return this.http.get(`${this.baseUrl}/files/profile-cover/${id}`);
  }
}
