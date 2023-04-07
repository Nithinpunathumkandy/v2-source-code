import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyGroupMasterComponent } from './competency-group-master.component';

describe('CompetencyGroupMasterComponent', () => {
  let component: CompetencyGroupMasterComponent;
  let fixture: ComponentFixture<CompetencyGroupMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyGroupMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyGroupMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
