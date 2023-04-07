import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactCategoryAddModalComponent } from './impact-category-add-modal.component';

describe('ImpactCategoryAddModalComponent', () => {
  let component: ImpactCategoryAddModalComponent;
  let fixture: ComponentFixture<ImpactCategoryAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpactCategoryAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactCategoryAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
