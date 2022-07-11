import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  public username = window.sessionStorage.getItem('userName');

  constructor(private authService: ServiceService) { }

  ngOnInit(): void {
  }

  toggleSidebar(){
    this.toggleSidebarForMe.emit();
  }

  onLogout(){
    this.authService.logout();                      
  }

}
