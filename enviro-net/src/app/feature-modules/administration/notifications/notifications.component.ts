import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdministrationService } from '../administration.service';
import { Notification } from '../model/notification.model';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnChanges{
  displayedColumns: string[] = ['number'];
  @Input() openNotifications: boolean = false;
  @Input() userId!: number;
  
  showNotifications: boolean = false;
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  unreadNotifications: number = 0;
  notifications: Notification[] = [];

  constructor(
    private service: AdministrationService, 
    private snackBar: MatSnackBar) {
      if (this.userId) {
        this.loadNotifications();
      }  
    }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userId'] && this.userId) {
      this.loadNotifications();
    }
  }

  ngAfterViewInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.service.getAllNotifications(this.userId).subscribe(
      (result) => {
        this.notifications = result;
        this.unreadNotifications = result.filter(notification => !notification.read).length;
      }, (error) => {
        let errorMessage = 'Error while fetching users notifications. Please try again later';
        this.errorMessageDisplay(error, errorMessage);
      });
  }

  read(notification: Notification): void {
    this.service.readNotification(notification).subscribe(
      (updatedNotification) => {        
        this.loadNotifications();
      },
      (error) => {
        let errorMessage = 'Error while marking the notification as read. Please try again later';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
  }

  markAsUnread(notification: Notification): void {
    this.service.markAsUnread(notification).subscribe(
      (updatedNotification) => {
        this.loadNotifications();
      },
      (error) => {
        let errorMessage = 'Error while marking the notification as read. Please try again later';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
  }

  delete(notification: Notification): void {
    this.service.deleteNotification(notification.id).subscribe(
      () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
      },
      (error) => {
        let errorMessage = 'Error while deleting the notification. Please try again later';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
  }

  readAll(): void {
    this.service.readAllNotifications(this.userId).subscribe(
      (updatedNotifications) => {
        this.notifications = updatedNotifications;
        this.loadNotifications();
      },
      (error) => {
        let errorMessage = 'Error while marking all notifications as read. Please try again later';
        this.errorMessageDisplay(error, errorMessage);
      }
    );
  }

  errorMessageDisplay(error: any, errorMessage : string, duration: number = 5000) : void{
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    }
    this.snackBar.open(errorMessage, 'Close', { 
      duration: duration,
      panelClass: 'green-snackbar' });
    console.error('Error :', error);
  }
}
