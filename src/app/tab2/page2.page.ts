import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2-page2',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Tab Two - Page 2
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <ion-button (click)="generateAlert()">Generate Alert</ion-button>
      <ion-item>
        <ion-label>Priority</ion-label>
        <ion-input
          [value]="priority"
          debounce="1000"
          (ionChange)="subscribeBackButton($event.detail.value)">
        </ion-input>
      </ion-item>
    </ion-content>
  `,
  styles: [`
  
  `]
})
export class Tab2Page2Page implements OnInit, OnDestroy {
  subscription: Subscription;
  priority = 1;

  constructor (
    private alertCtrl: AlertController,
    private toastCrtl: ToastController,
    private platform: Platform
  ) { }

  async generateAlert (message?) {
    message = message || 'Generic alert';
    const alert = await this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    });
    alert.present();
  }
  async generateToast (message) {
    const toast = await this.toastCrtl.create({
      message: message, duration: 1200
    });
    toast.present();
  }

  async subscribeBackButton(priority: number) {
    priority = priority || -1;
    console.log(`Change backButton priority to ${priority}`);
    if (this.subscription) { this.subscription.unsubscribe(); }
    if (isNaN(priority) || priority < 0) {
      this.generateToast('backButton Priority removed');
      return;
    }
    this.subscription = this.platform.backButton
      .subscribeWithPriority(priority, () => this.generateAlert('Subscription Handled'));
    this.generateToast(`Subscription to ${priority} done.`);
  }

  ngOnInit(): void {
    this.subscribeBackButton(this.priority);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription = null;
  }
}
