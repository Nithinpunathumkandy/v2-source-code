import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFindingsComponent } from './edit-findings.component';

describe('EditFindingsComponent', () => {
  let component: EditFindingsComponent;
  let fixture: ComponentFixture<EditFindingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFindingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFindingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
