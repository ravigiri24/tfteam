import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient,private router:Router) {
    // this.rootUrl = 'http://localhost/backend/RkApi/';
 
 
   }
   //frontendUrl="https://tractorfactory.in/#"
   
  rootUrl = 'http://localhost/tractorDuniya/tractorDuniya/tractorDuniya/tractorDuniyaAdmin/'
   // rootUrl= "https://tractorfactory.in/admin/backend/tractorDuniyaAdmin/"
 
   
   postapi(x: any, object: any): any {
  //  let response:any= this.http.post(this.rootUrl + x, object).pipe(map((res) => res))
  //  if(response.msg=='Invalid Access'){
  //     this.router.navigate(['/login'])
  //  }else{
  //   return response
  //  }
     return this.http.post(this.rootUrl + x, object).pipe(map((res) => res));
   }
 
   getapi(x: any): Observable<any> {
     return this.http.get<any>(this.rootUrl + x).pipe(map((res) => res));
   }
}
