import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceStatusHistoryLoaderComponent } from './compliance-status-history-loader.component';

describe('ComplianceStatusHistoryLoaderComponent', () => {
  let component: ComplianceStatusHistoryLoaderComponent;
  let fixture: ComponentFixture<ComplianceStatusHistoryLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceStatusHistoryLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceStatusHistoryLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
