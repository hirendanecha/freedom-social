import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private baseUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getPosts() {
    return this.http.get(`${this.baseUrl}posts/`);
  }
}
