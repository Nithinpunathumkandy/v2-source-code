import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderMasterComponent } from './stakeholder-master.component';

describe('StakeholderMasterComponent', () => {
  let component: StakeholderMasterComponent;
  let fixture: ComponentFixture<StakeholderMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
