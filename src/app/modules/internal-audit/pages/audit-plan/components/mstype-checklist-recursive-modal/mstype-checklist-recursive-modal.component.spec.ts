import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MstypeChecklistRecursiveModalComponent } from './mstype-checklist-recursive-modal.component';

describe('MstypeChecklistRecursiveModalComponent', () => {
  let component: MstypeChecklistRecursiveModalComponent;
  let fixture: ComponentFixture<MstypeChecklistRecursiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MstypeChecklistRecursiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MstypeChecklistRecursiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
