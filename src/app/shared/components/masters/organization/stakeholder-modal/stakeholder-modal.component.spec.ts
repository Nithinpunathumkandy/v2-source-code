import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderModalComponent } from './stakeholder-modal.component';

describe('StakeholderModalComponent', () => {
  let component: StakeholderModalComponent;
  let fixture: ComponentFixture<StakeholderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
