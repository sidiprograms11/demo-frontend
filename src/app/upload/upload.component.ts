// src/app/upload/upload.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';

type Candidate = {
  id: number;
  email: string;
  filename: string;
  contentType: string;
  messageText: string;
  uploadedAt: string;
};

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  // ---- champs formulaire
  email = '';
  message = '';
  file?: File;

  // ---- état UI
  candidates: Candidate[] = [];
  loading = false;
  progress = 0;
  dragOver = false;
  year = new Date().getFullYear();

  // ---- API
  api = `${environment.apiBase}/api/candidates`;

  constructor(private http: HttpClient) {}
  ngOnInit() { this.load(); }

  // ========== Drag & Drop ==========
  onDragOver(e: DragEvent) {
    e.preventDefault(); // indispensable pour autoriser le drop
    this.dragOver = true;
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    const f = e.dataTransfer?.files?.[0];
    if (!f) return;
    if (f.type !== 'application/pdf') {
      alert('Merci d’envoyer un PDF uniquement.');
      return;
    }
    this.file = f;
  }

  // ========== Sélecteur <input type="file"> ==========
  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0] || undefined;
    if (f && f.type !== 'application/pdf') {
      alert('Merci d’envoyer un PDF uniquement.');
      return;
    }
    this.file = f;
  }

  // ========== Submit (avec progression) ==========
  submit() {
    if (!this.email || !this.file) return;

    const fd = new FormData();
    fd.append('email', this.email);
    fd.append('message', this.message || '');
    fd.append('cv', this.file); // @RequestParam("cv") côté Spring

    this.loading = true;
    this.progress = 0;

    this.http.post(this.api, fd, { observe: 'events', reportProgress: true })
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const total = event.total ?? 1;
            this.progress = Math.round((event.loaded / total) * 100);
          }
          if (event.type === HttpEventType.Response) {
            this.loading = false;
            this.progress = 100;
            // reset
            this.email = '';
            this.message = '';
            this.file = undefined;
            this.load();
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Upload error:', err);
          alert('Échec de l’envoi.');
        }
      });
  }

  // ========== Liste / actions ==========
  load() {
    this.http.get<Candidate[]>(this.api).subscribe({
      next: d => this.candidates = d,
      error: e => console.error('List error:', e),
    });
  }

  download(id: number) {
    window.location.href = `${this.api}/${id}/cv`;
  }

  remove(id: number) {
    if (!confirm('Supprimer cette candidature ?')) return;
    this.http.delete(`${this.api}/${id}`).subscribe({
      next: () => this.load(),
      error: e => console.error('Delete error:', e),
    });
  }
}
  