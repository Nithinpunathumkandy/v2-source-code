import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportLoaderComponent } from './user-report-loader.component';

describe('UserReportLoaderComponent', () => {
  let component: UserReportLoaderComponent;
  let fixture: ComponentFixture<UserReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
