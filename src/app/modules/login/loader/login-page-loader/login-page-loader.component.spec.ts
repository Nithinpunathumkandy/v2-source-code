import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageLoaderComponent } from './login-page-loader.component';

describe('LoginPageLoaderComponent', () => {
  let component: LoginPageLoaderComponent;
  let fixture: ComponentFixture<LoginPageLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginPageLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
