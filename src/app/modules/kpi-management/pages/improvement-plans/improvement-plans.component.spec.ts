import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementPlansComponent } from './improvement-plans.component';

describe('ImprovementPlansComponent', () => {
  let component: ImprovementPlansComponent;
  let fixture: ComponentFixture<ImprovementPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementPlansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
