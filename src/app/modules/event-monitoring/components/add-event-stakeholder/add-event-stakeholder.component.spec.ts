import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventStakeholderComponent } from './add-event-stakeholder.component';

describe('AddEventStakeholderComponent', () => {
  let component: AddEventStakeholderComponent;
  let fixture: ComponentFixture<AddEventStakeholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventStakeholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventStakeholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
