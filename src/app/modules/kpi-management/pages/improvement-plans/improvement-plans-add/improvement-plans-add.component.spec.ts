import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementPlansAddComponent } from './improvement-plans-add.component';

describe('ImprovementPlansAddComponent', () => {
  let component: ImprovementPlansAddComponent;
  let fixture: ComponentFixture<ImprovementPlansAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementPlansAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementPlansAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
