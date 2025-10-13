import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TfCodeBackDatedComponent } from './tf-code-back-dated.component';

describe('TfCodeBackDatedComponent', () => {
  let component: TfCodeBackDatedComponent;
  let fixture: ComponentFixture<TfCodeBackDatedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TfCodeBackDatedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TfCodeBackDatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
