import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateChildDataComponent } from './template-child-data.component';

describe('TemplateChildDataComponent', () => {
  let component: TemplateChildDataComponent;
  let fixture: ComponentFixture<TemplateChildDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateChildDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateChildDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
