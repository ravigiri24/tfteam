import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchJobcardByTfComponent } from './search-jobcard-by-tf.component';

describe('SearchJobcardByTfComponent', () => {
  let component: SearchJobcardByTfComponent;
  let fixture: ComponentFixture<SearchJobcardByTfComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchJobcardByTfComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchJobcardByTfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
