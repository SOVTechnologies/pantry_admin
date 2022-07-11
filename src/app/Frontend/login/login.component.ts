import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ServiceService } from '../../../app/service/service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  private formSubmitAttempt!: boolean;

  hide = true;
  setMsg: any = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: ServiceService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(data: any) {
    if (this.form.get('userName')?.value) {
      const user = data.userName.substring(0,4);
      const _user = data.userName.substring(0,3);
      if(user == "ILOM" || _user == "ILO"){
        window.sessionStorage.setItem('userName', data.userName);
        this.authService.login(this.form.value);
      }
      else{
        this.setMsg = 'Username is invalid';
      }
      
    }
    else{
      this.setMsg = 'Username and Password is invalid';
      // console.log('Error');
    }
    this.formSubmitAttempt = true;
  }

}
