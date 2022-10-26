import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamerpageComponent } from './streamerpage.component';

describe('StreamerpageComponent', () => {
  let component: StreamerpageComponent;
  let fixture: ComponentFixture<StreamerpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StreamerpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamerpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
