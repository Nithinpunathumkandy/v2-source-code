import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserKpiMasterComponent } from './user-kpi-master.component';

describe('UserKpiMasterComponent', () => {
  let component: UserKpiMasterComponent;
  let fixture: ComponentFixture<UserKpiMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserKpiMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserKpiMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
