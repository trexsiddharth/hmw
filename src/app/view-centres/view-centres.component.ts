import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../app/Services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-centres',
  templateUrl: './view-centres.component.html',
  styleUrls: ['./view-centres.component.css']
})
export class ViewCentresComponent implements OnInit {
  centres:any=[];
  identityNumber;
  constructor(private _auth:AuthService, private http:HttpClient) { }

  ngOnInit() {
    if(localStorage.getItem('identityNumber'))
    this.identityNumber=localStorage.getItem('identityNumber');

       this._auth.getCentres(this.identityNumber).subscribe(res=>{
         this.centres=res;
         console.log(this.centres);
       })
  }

}
