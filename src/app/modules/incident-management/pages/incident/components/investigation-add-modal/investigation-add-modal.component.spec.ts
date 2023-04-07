import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationAddModalComponent } from './investigation-add-modal.component';

describe('InvestigationAddModalComponent', () => {
  let component: InvestigationAddModalComponent;
  let fixture: ComponentFixture<InvestigationAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
