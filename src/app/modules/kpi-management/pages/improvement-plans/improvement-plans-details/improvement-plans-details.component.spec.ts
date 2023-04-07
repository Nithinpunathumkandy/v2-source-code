import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementPlansDetailsComponent } from './improvement-plans-details.component';

describe('ImprovementPlansDetailsComponent', () => {
  let component: ImprovementPlansDetailsComponent;
  let fixture: ComponentFixture<ImprovementPlansDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementPlansDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementPlansDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
