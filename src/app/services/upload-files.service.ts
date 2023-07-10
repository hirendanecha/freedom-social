import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadFilesService {
  private baseUrl = environment.serverUrl + 'utils';

  constructor(private http: HttpClient) {}

  upload(
    file: File,
    id: any,
    idx: any,
    defaultType: string
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('folder', 'product');
    formData.append('id', id);
    formData.append('index', idx);
    formData.append('default', defaultType);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'json',
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    let id = window.sessionStorage.product_id;
    return this.http.get(`${this.baseUrl}/files/product/${id}`);
  }
}
