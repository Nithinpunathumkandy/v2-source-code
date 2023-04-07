import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberIncidentCommentModalComponent } from './cyber-incident-comment-modal.component';

describe('CyberIncidentCommentModalComponent', () => {
  let component: CyberIncidentCommentModalComponent;
  let fixture: ComponentFixture<CyberIncidentCommentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyberIncidentCommentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyberIncidentCommentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
