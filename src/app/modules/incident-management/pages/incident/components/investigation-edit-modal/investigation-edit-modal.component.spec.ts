import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationEditModalComponent } from './investigation-edit-modal.component';

describe('InvestigationEditModalComponent', () => {
  let component: InvestigationEditModalComponent;
  let fixture: ComponentFixture<InvestigationEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
