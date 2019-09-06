import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {NgxAutoScroll} from "ngx-auto-scroll";
import { UserService } from 'src/app/user.service';

declare let BotUI: Function;

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})

export class OnboardingComponent implements OnInit {

  @ViewChild(NgxAutoScroll) ngxAutoScroll: NgxAutoScroll;
 
   
  user_profile: any = [];
  answer: FormGroup;
  show1 : boolean = true;
  sent : any = [];
  profile :  any = [];
  message :  any = [];
  personal: any;
  Data : any;
  Data1 : any;
  response_arr:any=[];
  show_arr:any=[];
  previous_chats: any;
  user: any;
  DoNotshowfull : boolean ;

  botui: any;

  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private http:HttpClient,
    public userObj: UserService
  ) { 
    this.answer = this._formBuilder.group({
      'ans': [''],
    });
  }    

  ngOnInit() {
    this.botui =  BotUI('my-botui-app');

    let angularthis = this;
    angularthis.botui.message.add({ // show a message
      human: true,
      delay: 300,
      loading: true,    
      content: 'Whats your name?'
    }).then(function () { // wait till its shown
      return angularthis.botui.action.text({ // show 'text' action
        action: {
          placeholder: 'Your name'
        }
      });
    }).then(function (res) { // get the result
      angularthis.botui.message.add({
        delay: 300,
        loading: true, 
        content: 'Your name is ' + res.value
      });
    });

    const data = new FormData();
    data.append('identity_number',localStorage.getItem('identity_number'));;

    this.http.post('https://partner.hansmatrimony.com/api/getProfile', data ).subscribe((res : any) =>{
      this.user = res;
      //console.log('mobile number = ',this.user.family.mobile);
      //localStorage.setItem('mobile_number','91'+this.user.family.mobile);
      console.log(localStorage.getItem('mobile_number'));

    })

    this.http.get('https://partner.hansmatrimony.com/api/getMessages?from='+localStorage.getItem('mobile_number')).subscribe((res : any) => {
      this.previous_chats = res;
      let l = this.previous_chats.length;
      for(let i=0;i<l;i++){
          if(this.previous_chats[i].type === 'IN'){
            this.show_arr.push({'side':1,'data':this.previous_chats[i].message,'sent':1,'message':0,'profile':0});
          } 
      
          else if(this.previous_chats[i].type === 'OUT'){
              if(JSON.parse(this.previous_chats[i].message).type === 'message'){
                this.show_arr.push({'side':1,'data':JSON.parse(this.previous_chats[i].message).apiwha_autoreply,'sent':0,'message':1,'profile':0});
              }
              else{
                this.show_arr.push({'side':1,'data':JSON.parse(this.previous_chats[i].message).apiwha_autoreply,'sent':0,'message':0,'profile':1});
              }
            }
        
      }    
      var div = (<HTMLInputElement>document.getElementById('body'));
      // div.scrollIntoView(false);
      console.log(div.clientHeight)
      console.log(div.scrollHeight);
      console.log(div.offsetHeight);
     
  })
     
      console.log(this.show_arr);
      this.DoNotshowfull = true;
    
  }

  knowMore(){
   this.DoNotshowfull = false;
  }

  read(data){
    (<HTMLInputElement>document.getElementById('text')).value = '';
    this.show_arr.push({'side':1,'data':this.answer.value.ans,'sent':1,'message':0,'profile':0}) 
    this.chatRequest(data);
  }

  sendresponse(data){
    this.show_arr.push({'side':1,'data':data,'sent':1,'message':0,'profile':0}) 
    this.chatRequest(data);
  }

  showProfile(value){
        // const Data = new FormData();
        // Data.append('identity_number' , localStorage.getItem('identity_number'));
        // this.sent = false;
        // this.profile = true;

        // this.http.post('https://partner.hansmatrimony.com/api/getRecommendedProfiles' , Data).subscribe((res : any) => {
        //   this.user_profile = res;
        //   console.log(res);   
        // })

        this.show_arr.push({'side':1,'data':value,'sent':1,'message':0,'profile':0}) ;
        this.chatRequest(value);
  }

  chatRequest(data){

    if(data ==='typed'){
      this.Data = {
        from : localStorage.getItem('mobile_number'),
         to : localStorage.getItem('mobile_number'),
         event : "INBOX",
         text : this.answer.value.ans ,
         channel_name : "na"
      }
    }
    else{
      this.Data = {
        from : localStorage.getItem('mobile_number'),
         to : localStorage.getItem('mobile_number'),
         event : "INBOX",
         text : data ,
         channel_name : "na"
      }
    }
   
    

    var myJSON = JSON.stringify(this.Data);
    console.log(myJSON);

    const data1 = new FormData();
    data1.append('data',myJSON);

  
     this.http.post(' https://partner.hansmatrimony.com/api/sendMessages' , data1 ).subscribe((res : any) => {
        this.user_profile = res;
        console.log(this.user_profile);
        if(this.user_profile.type === 'profile')
            this.show_arr.push({'side':0,'data':this.user_profile.apiwha_autoreply,'sent':0,'message':0,'profile':1});

        if(this.user_profile.type === 'message')
            this.show_arr.push({'side':0,'data':this.user_profile.apiwha_autoreply,'sent':0,'message':1,'profile':0});
            
        this.revertResponse();
     }) 
  }  
  
  revertResponse(){
    this.Data1 = {
      from : localStorage.getItem('mobile_number'),
      to : localStorage.getItem('mobile_number'),
      event : "MESSAGEPROCESSED",
      channel_name : "na"
    }

    var myJSON2 = JSON.stringify(this.Data1);
    console.log(myJSON2);

    const data2 = new FormData();
    data2.append('data',myJSON2);
  
    this.http.post(' https://partner.hansmatrimony.com/api/sendMessages' , data2 ).subscribe((res : any) => {
      console.log(res);
    })
  }

}
