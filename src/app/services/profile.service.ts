import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private baseUrl = environment.serverUrl + 'profile';

  constructor(private http: HttpClient) {}

  groupsAndPosts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/groupsAndPosts`);
  }

  getGroups(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getGroups`);
  }

  getGroupBasicDetails(uniqueLink: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getGroupBasicDetails/${uniqueLink}`);
  }

  getGroupPostById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getGroupPostById/${id}`);
  }

  getGroupFileResourcesById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getGroupFileResourcesById/${id}`);
  }
}
