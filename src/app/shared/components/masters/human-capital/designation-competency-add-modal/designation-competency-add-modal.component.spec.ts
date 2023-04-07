import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationCompetencyAddModalComponent } from './designation-competency-add-modal.component';

describe('DesignationCompetencyAddModalComponent', () => {
  let component: DesignationCompetencyAddModalComponent;
  let fixture: ComponentFixture<DesignationCompetencyAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignationCompetencyAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationCompetencyAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
