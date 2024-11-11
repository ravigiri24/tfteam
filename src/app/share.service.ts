import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  constructor(private router:Router) { }
  set_staff_detail_session(data:any){
localStorage.setItem("userDetails",JSON.stringify(data))
  }
  get_staff(){
 return  localStorage.getItem("userDetails") || null
  }
  getListObj(src:any, isImage:any=false, images:any=[],all:any,keys:any=[]) {
    let getStaffDetail:any = this.get_staff();
    let getStaff:any = JSON.parse(getStaffDetail);
    let obj = {
      src: src,
      operate: getStaff?.staffCode,
      isImage: isImage,
      images: images,
      all:all,
      keys:keys
    };
    return obj
  }
  checkLogin(){
    let user=this.get_staff()
    if(user){
      let userde=JSON.parse(user)
      if(userde){
        this.router.navigate(['/customer-management'])
      }
    }else{
      this.router.navigate(['/login'])
    }
  }
}
