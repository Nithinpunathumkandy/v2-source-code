import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentTitleComponent } from './add-incident-title.component';

describe('AddIncidentTitleComponent', () => {
  let component: AddIncidentTitleComponent;
  let fixture: ComponentFixture<AddIncidentTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
