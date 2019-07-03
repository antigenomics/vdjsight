import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NetworkStatusModule } from 'components/network/network-status.module';
import { NotificationsModule } from 'components/notifications/notifications.module';
import { ApplicationComponent } from './application.component';

describe('ApplicationComponent', () => {

  beforeEach(async(() => TestBed.configureTestingModule({
      imports:      [ RouterTestingModule, NotificationsModule, NetworkStatusModule ],
      declarations: [ ApplicationComponent ],
      providers:    [ provideMockStore() ]
    }).compileComponents()
  ));

  test('should create the app', () => {
    const fixture = TestBed.createComponent(ApplicationComponent);
    const app     = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
