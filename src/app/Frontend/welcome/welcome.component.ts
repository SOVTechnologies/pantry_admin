import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service/service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  isLoggedIn$!: Observable<boolean>;
  visible!: boolean;

  constructor(private authService: ServiceService) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  // onLogout(){
  //   this.authService.logout();                      
  // }

  show(event: boolean) {
    this.visible = event;
  }

  hide(event: boolean) {
    this.visible = event;
  }

}
