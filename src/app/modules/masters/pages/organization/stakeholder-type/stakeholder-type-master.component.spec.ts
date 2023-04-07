import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderTypeMasterComponent } from './stakeholder-type-master.component';

describe('StakeholderTypeMasterComponent', () => {
  let component: StakeholderTypeMasterComponent;
  let fixture: ComponentFixture<StakeholderTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StakeholderTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
