import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {
    // this.rootUrl = 'http://localhost/backend/RkApi/';
 
 
   }
   //frontendUrl="https://tractorfactory.in/#"
   
   rootUrl = 'http://localhost/tractorDuniya/tractorDuniya/tractorDuniya/tractorDuniyaAdmin/'
    //rootUrl= "https://tractorfactory.in/admin/backend/tractorDuniyaAdmin/"
 
   
   postapi(x: any, object: any): any {
     return this.http.post(this.rootUrl + x, object).pipe(map((res) => res));
   }
 
   getapi(x: any): Observable<any> {
     return this.http.get<any>(this.rootUrl + x).pipe(map((res) => res));
   }
}
