import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyTypesModalComponent } from './competency-types-modal.component';

describe('CompetencyTypesModalComponent', () => {
  let component: CompetencyTypesModalComponent;
  let fixture: ComponentFixture<CompetencyTypesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetencyTypesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyTypesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
