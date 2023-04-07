import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprovementPlansListComponent } from './improvement-plans-list.component';

describe('ImprovementPlansListComponent', () => {
  let component: ImprovementPlansListComponent;
  let fixture: ComponentFixture<ImprovementPlansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImprovementPlansListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprovementPlansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
