import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationCompetencyModalComponent } from './designation-competency-modal.component';

describe('DesignationCompetencyModalComponent', () => {
  let component: DesignationCompetencyModalComponent;
  let fixture: ComponentFixture<DesignationCompetencyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationCompetencyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationCompetencyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
