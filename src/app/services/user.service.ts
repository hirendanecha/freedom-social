import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getImageUrl(url: string): Observable<Blob> {
    return this.httpClient.get(url, {
      responseType: "blob",
    });
  }
}
