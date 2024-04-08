import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './infrastructure/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'enviro-net';

  constructor(private authService: AuthService, private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('EnviroNet');
    this.checkIfUserExists();
  }

  private checkIfUserExists(): void {
    this.authService.checkIfUserExists();
  }
}