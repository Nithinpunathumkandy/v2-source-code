import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentManagementMasterComponent } from './incident-management-master.component';

describe('IncidentManagementMasterComponent', () => {
  let component: IncidentManagementMasterComponent;
  let fixture: ComponentFixture<IncidentManagementMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentManagementMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentManagementMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
