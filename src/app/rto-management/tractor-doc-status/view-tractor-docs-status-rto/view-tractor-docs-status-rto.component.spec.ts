import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewTractorDocsStatusRtoComponent } from './view-tractor-docs-status-rto.component';

describe('ViewTractorDocsStatusRtoComponent', () => {
  let component: ViewTractorDocsStatusRtoComponent;
  let fixture: ComponentFixture<ViewTractorDocsStatusRtoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewTractorDocsStatusRtoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewTractorDocsStatusRtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
