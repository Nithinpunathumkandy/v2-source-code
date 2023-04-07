import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportMasterComponent } from './user-report-master.component';

describe('UserReportMasterComponent', () => {
  let component: UserReportMasterComponent;
  let fixture: ComponentFixture<UserReportMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserReportMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
