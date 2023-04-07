import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaCategoryModalComponent } from './sla-category-modal.component';

describe('SlaCategoryModalComponent', () => {
  let component: SlaCategoryModalComponent;
  let fixture: ComponentFixture<SlaCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlaCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlaCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
