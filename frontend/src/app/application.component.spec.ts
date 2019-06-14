import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ApplicationComponent } from './application.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('ApplicationComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:      [
        RouterTestingModule
      ],
      declarations: [
        ApplicationComponent
      ],
      providers:    [
        provideMockStore()
      ]
    }).compileComponents();
  }));

  test('should create the app', () => {
    const fixture = TestBed.createComponent(ApplicationComponent);
    const app     = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
