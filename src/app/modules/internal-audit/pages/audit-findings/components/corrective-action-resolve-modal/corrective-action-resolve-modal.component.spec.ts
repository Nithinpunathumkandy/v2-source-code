import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectiveActionResolveModalComponent } from './corrective-action-resolve-modal.component';

describe('CorrectiveActionResolveModalComponent', () => {
  let component: CorrectiveActionResolveModalComponent;
  let fixture: ComponentFixture<CorrectiveActionResolveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrectiveActionResolveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorrectiveActionResolveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
