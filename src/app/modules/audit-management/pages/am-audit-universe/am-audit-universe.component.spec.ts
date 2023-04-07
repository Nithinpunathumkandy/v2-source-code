import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditUniverseComponent } from './am-audit-universe.component';

describe('AmAuditUniverseComponent', () => {
  let component: AmAuditUniverseComponent;
  let fixture: ComponentFixture<AmAuditUniverseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditUniverseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditUniverseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
