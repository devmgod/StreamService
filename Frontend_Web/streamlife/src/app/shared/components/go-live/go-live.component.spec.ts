import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoLiveComponent } from './go-live.component';

describe('GoLiveComponent', () => {
  let component: GoLiveComponent;
  let fixture: ComponentFixture<GoLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoLiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
