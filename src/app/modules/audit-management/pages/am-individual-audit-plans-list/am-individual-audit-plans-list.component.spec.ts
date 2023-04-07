import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmIndividualAuditPlansListComponent } from './am-individual-audit-plans-list.component';

describe('AmIndividualAuditPlansListComponent', () => {
  let component: AmIndividualAuditPlansListComponent;
  let fixture: ComponentFixture<AmIndividualAuditPlansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmIndividualAuditPlansListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmIndividualAuditPlansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
