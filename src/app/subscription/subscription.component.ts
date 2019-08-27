import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../subscription.service'
import { AuthService } from '../Services/auth.service';
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit  {
  data :any;
  constructor(private sub: SubscriptionService, private auth : AuthService) {  }

  pay(amt,type)
  {
    let rzp = this.sub.payNowT(amt,type);
    rzp.open();
  }

  ngOnInit(){
  this.auth.getSubscription().subscribe(res=>{
    this.data = res;
    console.log(res);
    console.log(this.data.PersonalizedPremium);
    
  })
  }

}
