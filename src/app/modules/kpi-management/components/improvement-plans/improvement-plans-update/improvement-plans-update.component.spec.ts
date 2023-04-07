import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementPlansUpdateComponent } from './improvement-plans-update.component';

describe('ImprovementPlansUpdateComponent', () => {
  let component: ImprovementPlansUpdateComponent;
  let fixture: ComponentFixture<ImprovementPlansUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementPlansUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementPlansUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
