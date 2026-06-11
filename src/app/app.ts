import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Dialog } from './components/dialog/dialog';
import { MatDialog } from '@angular/material/dialog';

type ActionButton = {
  label: string;
  icon: string;
  variant: 'filled' | 'raised' | 'outlined' | 'soft';
  size: 'standard' | 'wide' | 'tall' | 'compact';
  id: string;
};

@Component({
  selector: 'app-root',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  dialog = inject(MatDialog);
  protected readonly title = signal('Execo');
  protected api: string = 'http://localhost:3000/api';
  private http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }


  protected readonly actionButtons: ActionButton[] = [
    { label: 'list', icon: 'list_add', variant: 'filled', size: 'wide', id: 'list' },
    { label: 'Update', icon: 'update', variant: 'raised', size: 'wide', id: 'update' },
  ];

  protected runLater(action: ActionButton): void {
    console.info(`${action.label} sera branche plus tard.`);
    this.http.post<{ message: string, data: any[] }>(`${this.api}/action`, { actionName: action.id }).subscribe({
      next: (response) => {
        console.log('Action exécutée avec succès:', response);
        if (response.data) {
          this.dialog.open(Dialog, {
            width: 'min(920px, calc(100vw - 32px))',
            maxWidth: 'none',
            maxHeight: 'calc(100vh - 32px)',
            data: {
              message: response.message,
              data: response.data
            },
          });
        }
      },
      error: (error) => console.error('Erreur lors de l\'enregistrement de l\'action:', error)
    });
  }
}
