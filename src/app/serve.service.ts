import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServeService {
  // private apiUrl = 'http://10.0.80.3:8000/api/';
  // private apiUrl = 'http://192.168.137.146:8000/api/';
  private apiUrl = 'http://localhost:8000/api/';
  token = localStorage.getItem('personal_access_token');
  constructor(private http: HttpClient
  ) {}

  logins(email: any, password: any): Observable<any> {
    return this.http.post(this.apiUrl + "AdminLogin", { email, password});
  }

  setToken(token: string): void {
    localStorage.setItem('personal_access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('personal_access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  setStaffID(id: any): any {
    localStorage.setItem('staffID', id);
  }

  getStaffID(): any | null {
    localStorage.getItem('staffID');
  }

  logout() {
    const headers = new HttpHeaders({'Authorization': `Bearer ${this.token}`});
    if (!this.token) {
      console.error('No token found in local storage');
      return;
    }
    console.log(headers);

    this.http.post(this.apiUrl + "logout", {}, { headers }).subscribe(
      (response) => {
        console.log(response);
        localStorage.removeItem('personal_access_token');
        console.log(this.token);
      },
      (error) => {
        localStorage.removeItem('personal_access_token');
        console.error('Error during logout', error);
      }
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('personal_access_token');
    return !!token;
  }

  getStaff(): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    
    return this.http.get(this.apiUrl + "user", { headers });
  }

  getTransactionsRec(){
    const token = this.getToken();
    const headers = new HttpHeaders({'Authorization': `Bearer ${token}`});
    console.log(token);

    return this.http.get(this.apiUrl + "getTransactionsRec", { headers } );
  }

  getTransactionRel(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl + "TransactionRel", { headers });
  }

  doneTransac(id:any): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.apiUrl + "doneTransac/" + id, { headers });
  }

  getCustTransaction(transId: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getTransCust/" + transId, { headers });
  }

  getLaundryDet(id:any): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getForRel/" + id, {headers});
  }

  getAddServDet(id:any): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getAddServRel/" + id, {headers});
  }

  updateStatus(data: any, id: any, staffID: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const request = {...data, staffID};
    return this.http.post(this.apiUrl + "updateStatus/" + id, request, { headers });
  }


  getLaundryDetails(transId: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getLaundryDetails/" + transId, { headers });
  }

getAddService(transID: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getAddService/" + transID, { headers });
  }

getAddServiceTotal(transId: any): Observable<any>{
  const token = this.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(this.apiUrl + "getAddServiceTotal/" + transId, {headers});
}

getLaundryDetTotal(transId: any): Observable<any>{
  const token = this.getToken();
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(this.apiUrl + "getLaundryDetTotal/" + transId, {headers});
}

totalPriceLaundry(transId: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "totalPriceLaundry/" + transId, { headers });
  }

totalPriceService(transId: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "totalPriceService/" + transId, { headers });
  }

  addPayment(id: any, total: any){
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const staffId = localStorage.getItem('staffID');
    const data = {id, total, staffId};
    return this.http.post(this.apiUrl + 'addPayment', data, {headers});
  }

  paymentStatus(transId: any): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "paymentStatus/" + transId, { headers });
  }


saveLaundryDetails(data: any){
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl + "saveLaundryDetails", data, { headers });
  }

submitLaundryTrans(amount: any, staffId:any, transId: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = {amount, staffId};

    console.log(data);
    return this.http.post(this.apiUrl + "submitLaundryTrans/" + transId, data, { headers });
  }


saveServiceData(data: any){
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl + "saveServiceData", data, { headers });
  }

  cancelTransactionLaundry(): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apiUrl + "saveServiceData", { headers });
  }





  getExpenses(staffID: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl + "getExpenses/" + staffID, { headers });
  }

  addExpense(data: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(this.apiUrl + "addExpense", data, { headers });
  }

  uploadExpImg(id: any, expImg: File): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('Expense_ID', id);
    formData.append('file', expImg);

    console.log(formData);
    return this.http.post(this.apiUrl + "uploadExpImg", formData, { headers })
  }

  getExpReceipt(expId: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getExpenses/" + expId, { headers });
  }

  checkImageUrl(url: string): Observable<boolean> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(url, { observe: 'response', responseType: 'blob', headers }).pipe(
      map(response => {
        return response.status === 200; // Return true if the status is 200
      }),
      catchError(() => {
        return of(false); // Return false if there's an error (e.g., 404, 500)
      })
    );
  }


  getCustomer(): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getCustomer", { headers });
  }

  getTotalTransactions(custId: any){
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getTotalTransactions/" + custId, { headers });
  } 

  getCustomerData(id: any): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getCustomerData/" + id, { headers });
  }

  getCustTransacHistory(custId: any): Observable<any>{
      const token = this.getToken();
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      return this.http.get(this.apiUrl + "findtrans/" + custId, { headers });
    }

  findtransactionprint(id: any) {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "printtrans/" + id, { headers });
  }

  // getincome(): Observable<any>{
  //   const token = this.getToken();
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
  //   return this.http.get(this.apiUrl + "getincome", { headers });
  // }


  getIncomeRepPayments(staffId: any): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getIncomeRepPayments/" + staffId, { headers });
  }

  getIncomeRepExpenses(staffId: any): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getIncomeRepExpenses/" + staffId, { headers });
  }

  getCash(staffId: any): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(this.apiUrl + "getCash/" + staffId, { headers });
  }

  receiveInitial(staffId: any, iniDate: any): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = {iniDate}
    console.log(iniDate);

    return this.http.post(this.apiUrl + "receiveInitial/" + staffId, data, { headers });
  }

  enterAmount(staffId: any, amount: any, cashId:any): Observable<any>{
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const data = {staffId, amount}
    console.log(data);
    return this.http.post(this.apiUrl + "enterAmount/" + cashId, data, { headers });
  }


}
