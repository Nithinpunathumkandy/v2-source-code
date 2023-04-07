import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceCountListComponent } from './compliance-count-list.component';

describe('ComplianceCountListComponent', () => {
  let component: ComplianceCountListComponent;
  let fixture: ComponentFixture<ComplianceCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
