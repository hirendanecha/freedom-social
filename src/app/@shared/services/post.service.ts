import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import parse from 'node-html-parser';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
httpOptions.headers.append(
  'Access-Control-Allow-Origin',
  'http://localhost:4200'
);

@Injectable({
  providedIn: 'root',
})
export class PostService {
  selectedFile: any;
  postData: any = {};
  private baseUrl = environment.serverUrl + 'posts';
  constructor(private http: HttpClient) { }

  upload(
    files: File,
    id: any,
    defaultType: string = 'post'
  ): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('folder', defaultType);
    formData.append('file', files);
    formData.append('id', id);
    formData.append('default', defaultType);
    console.log(formData)
    const req = new HttpRequest(
      'POST',
      `${this.baseUrl}/upload-post`,
      formData,
      {
        reportProgress: true,
        responseType: 'json',
      }
    );

    return this.http.request(req);
  }

  getPosts(reqBody: any) {
    return this.http.post(`${this.baseUrl}`, reqBody);
  }

  getPostsByProfileId(id) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
  getPostsByPostId(id) {
    return this.http.get(`${this.baseUrl}/get/${id}`);
  }

  getPostImg(): Observable<any> {
    let id = window.sessionStorage.user_id;
    return this.http.get(`${this.baseUrl}/files/post/${id}`);
  }

  createPost(postData: any): Observable<Object> {
    return this.http.post(`${this.baseUrl}/create`, postData);
  }

  getMetaData(url) {
    return this.http.post(`${this.baseUrl}/get-meta`, url);
  }

  deletePost(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  getComments(id): Observable<any> {
    return this.http.get(`${this.baseUrl}/comments/${id}`);
  }

  deleteComments(id): Observable<any> {
    return this.http.delete(`${this.baseUrl}/comments/${id}`);
  }
}
