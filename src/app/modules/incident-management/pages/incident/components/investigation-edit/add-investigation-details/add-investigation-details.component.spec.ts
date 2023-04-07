import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvestigationDetailsComponent } from './add-investigation-details.component';

describe('AddInvestigationDetailsComponent', () => {
  let component: AddInvestigationDetailsComponent;
  let fixture: ComponentFixture<AddInvestigationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInvestigationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInvestigationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
