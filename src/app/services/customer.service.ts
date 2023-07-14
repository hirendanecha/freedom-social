import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../constant/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private baseUrl = environment.serverUrl + 'customers';

  constructor(private http: HttpClient) {}

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  createCustomer(customer: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/register`, customer);
  }

  updateCustomer(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getCustomersList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all-customers`);
  }

  getCustomers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getZipData(zip: string, country: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/zip/${zip}?country=${country}`);
  }

  getCountriesData(): Observable<{ country_code: string; country: string }[]> {
    return this.http.get<{ country_code: string; country: string }[]>(
      `${this.baseUrl}/countries`
    );
  }

  updateProfile(customer: Customer): Observable<Object> {
    return this.http.post(`${this.baseUrl}/profile`, customer);
  }
}
