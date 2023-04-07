import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyMasterComponent } from './competency-master.component';

describe('CompetencyMasterComponent', () => {
  let component: CompetencyMasterComponent;
  let fixture: ComponentFixture<CompetencyMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetencyMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
