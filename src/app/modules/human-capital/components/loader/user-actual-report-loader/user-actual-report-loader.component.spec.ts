import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserActualReportLoaderComponent } from './user-actual-report-loader.component';

describe('UserActualReportLoaderComponent', () => {
  let component: UserActualReportLoaderComponent;
  let fixture: ComponentFixture<UserActualReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserActualReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserActualReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
