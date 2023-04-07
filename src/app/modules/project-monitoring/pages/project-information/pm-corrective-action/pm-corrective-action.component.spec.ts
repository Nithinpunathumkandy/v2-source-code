import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmCorrectiveActionComponent } from './pm-corrective-action.component';

describe('PmCorrectiveActionComponent', () => {
  let component: PmCorrectiveActionComponent;
  let fixture: ComponentFixture<PmCorrectiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmCorrectiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmCorrectiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
