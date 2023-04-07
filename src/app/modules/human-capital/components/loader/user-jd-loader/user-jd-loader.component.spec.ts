import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJdLoaderComponent } from './user-jd-loader.component';

describe('UserJdLoaderComponent', () => {
  let component: UserJdLoaderComponent;
  let fixture: ComponentFixture<UserJdLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserJdLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserJdLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
