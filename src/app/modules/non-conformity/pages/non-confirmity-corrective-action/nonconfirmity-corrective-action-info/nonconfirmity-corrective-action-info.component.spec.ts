import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonconfirmityCorrectiveActionInfoComponent } from './nonconfirmity-corrective-action-info.component';

describe('NonconfirmityCorrectiveActionInfoComponent', () => {
  let component: NonconfirmityCorrectiveActionInfoComponent;
  let fixture: ComponentFixture<NonconfirmityCorrectiveActionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonconfirmityCorrectiveActionInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonconfirmityCorrectiveActionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
