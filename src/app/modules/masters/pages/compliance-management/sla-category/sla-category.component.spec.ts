import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaCategoryComponent } from './sla-category.component';

describe('SlaCategoryComponent', () => {
  let component: SlaCategoryComponent;
  let fixture: ComponentFixture<SlaCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
