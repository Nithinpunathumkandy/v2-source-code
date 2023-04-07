import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactCategoryComponent } from './impact-category.component';

describe('ImpactCategoryComponent', () => {
  let component: ImpactCategoryComponent;
  let fixture: ComponentFixture<ImpactCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpactCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
