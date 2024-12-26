import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasingComponent } from './releasing.component';

describe('ReleasingComponent', () => {
  let component: ReleasingComponent;
  let fixture: ComponentFixture<ReleasingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleasingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleasingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
