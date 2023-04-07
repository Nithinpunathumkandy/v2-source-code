import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactCategoryNewComponent } from './impact-category-new.component';

describe('ImpactCategoryNewComponent', () => {
  let component: ImpactCategoryNewComponent;
  let fixture: ComponentFixture<ImpactCategoryNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpactCategoryNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpactCategoryNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
