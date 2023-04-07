import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRrLoaderComponent } from './user-rr-loader.component';

describe('UserRrLoaderComponent', () => {
  let component: UserRrLoaderComponent;
  let fixture: ComponentFixture<UserRrLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRrLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRrLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
