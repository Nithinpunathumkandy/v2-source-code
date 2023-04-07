import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectCorrectiveActionComponent } from './reject-corrective-action.component';

describe('RejectCorrectiveActionComponent', () => {
  let component: RejectCorrectiveActionComponent;
  let fixture: ComponentFixture<RejectCorrectiveActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectCorrectiveActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectCorrectiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
