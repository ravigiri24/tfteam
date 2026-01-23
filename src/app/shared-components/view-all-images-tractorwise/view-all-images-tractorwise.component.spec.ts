import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewAllImagesTractorwiseComponent } from './view-all-images-tractorwise.component';

describe('ViewAllImagesTractorwiseComponent', () => {
  let component: ViewAllImagesTractorwiseComponent;
  let fixture: ComponentFixture<ViewAllImagesTractorwiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAllImagesTractorwiseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAllImagesTractorwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
