import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsAuditTeamsDetailsLoaderComponent } from './ms-audit-teams-details-loader.component';

describe('MsAuditTeamsDetailsLoaderComponent', () => {
  let component: MsAuditTeamsDetailsLoaderComponent;
  let fixture: ComponentFixture<MsAuditTeamsDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsAuditTeamsDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsAuditTeamsDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
