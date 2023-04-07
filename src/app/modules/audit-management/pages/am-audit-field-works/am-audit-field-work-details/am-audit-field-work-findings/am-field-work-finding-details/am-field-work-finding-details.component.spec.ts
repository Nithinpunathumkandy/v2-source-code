import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmFieldWorkFindingDetailsComponent } from './am-field-work-finding-details.component';

describe('AmFieldWorkFindingDetailsComponent', () => {
  let component: AmFieldWorkFindingDetailsComponent;
  let fixture: ComponentFixture<AmFieldWorkFindingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmFieldWorkFindingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmFieldWorkFindingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
