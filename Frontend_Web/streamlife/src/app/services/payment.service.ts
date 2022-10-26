import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders,HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor( private http: HttpClient) { }
  deletePaymentMethod(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/delete-payment-method", requestData);
  }
  initPayment(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/payments", requestData);
  }
  initSubscription(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/subscribe", requestData);
  }
  getTotalTipsAndSubscribers(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-total-tips-subscribers", requestData);
  }
  getTotalBalance(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-total-balance", requestData);
  }
  transferWalletbalance(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/transfer-wallet-balance", requestData);
  }
  getCardData(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-card-data", requestData);
  }
  getCountries(): Observable<any> {
    return this.http.get(environment.baseApiUrl + "/get-countries");
  }
  getStates(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-regions", requestData);
  }
  changeRoutingNumber(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/change-bank-info", requestData);
  }
  getSavedAccount(requestData: any): Observable<any> {
    return this.http.post(environment.baseApiUrl + "/get-saved-account", requestData);
  }
}
