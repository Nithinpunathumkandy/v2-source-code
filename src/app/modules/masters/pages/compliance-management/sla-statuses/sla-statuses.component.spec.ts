import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaStatusesComponent } from './sla-statuses.component';

describe('SlaStatusesComponent', () => {
  let component: SlaStatusesComponent;
  let fixture: ComponentFixture<SlaStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
