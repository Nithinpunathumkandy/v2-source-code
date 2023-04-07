import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EaCorrectiveActionsResolveModalComponent } from './ea-corrective-actions-resolve-modal.component';

describe('EaCorrectiveActionsResolveModalComponent', () => {
  let component: EaCorrectiveActionsResolveModalComponent;
  let fixture: ComponentFixture<EaCorrectiveActionsResolveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EaCorrectiveActionsResolveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EaCorrectiveActionsResolveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
