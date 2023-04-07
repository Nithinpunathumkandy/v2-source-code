import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceAreaComponent } from './compliance-area.component';

describe('ComplianceAreaComponent', () => {
  let component: ComplianceAreaComponent;
  let fixture: ComponentFixture<ComplianceAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
