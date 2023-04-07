import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationAddComponent } from './investigation-add.component';

describe('InvestigationAddComponent', () => {
  let component: InvestigationAddComponent;
  let fixture: ComponentFixture<InvestigationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
