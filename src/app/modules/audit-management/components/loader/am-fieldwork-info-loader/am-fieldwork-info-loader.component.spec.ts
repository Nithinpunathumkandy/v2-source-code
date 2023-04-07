import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmFieldworkInfoLoaderComponent } from './am-fieldwork-info-loader.component';

describe('AmFieldworkInfoLoaderComponent', () => {
  let component: AmFieldworkInfoLoaderComponent;
  let fixture: ComponentFixture<AmFieldworkInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmFieldworkInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmFieldworkInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
