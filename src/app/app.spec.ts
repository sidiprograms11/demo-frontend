import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UploadComponent } from './upload/upload.component';

describe('UploadComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // UploadComponent est standalone : on l'importe directement
      imports: [UploadComponent, HttpClientTestingModule],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(UploadComponent);
    const cmp = fixture.componentInstance;
    expect(cmp).toBeTruthy();
  });

  it('should render title "Dépôt de CV"', () => {
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.detectChanges();
    const h1: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('Dépôt de CV');
  });

  it('should have submit button disabled initially', () => {
    const fixture = TestBed.createComponent(UploadComponent);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(btn.disabled).toBeTrue();
  });
});
