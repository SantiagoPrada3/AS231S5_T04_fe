import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import { Translation } from '../../core/interfaces/translation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-translations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.css']
})
export class TranslationsComponent implements OnInit {
  translations: Translation[] = [];
  newTranslation: Translation = {
    sourceText: '',
    translatedText: '',
    sourceLanguage: 'en',
    targetLanguage: 'es'
  };

  // Estado de edición
  editingId: string | null = null;
  editingSourceText: string = '';
  editingTranslatedText: string = '';
  editingSourceLanguage: string = 'en';
  editingTargetLanguage: string = 'es';

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.loadActiveTranslations();
  }

  createTranslation(): void {
    if (this.newTranslation.sourceText.trim()) {
      this.translationService.createTranslation({
        text: this.newTranslation.sourceText,
        sourceLang: this.newTranslation.sourceLanguage,
        targetLang: this.newTranslation.targetLanguage
      }).subscribe({
        next: (translation) => {
          this.translations.unshift(translation);
          this.newTranslation.sourceText = '';
          Swal.fire({
            icon: 'success',
            title: '¡Traducción creada!',
            text: 'La traducción se agregó correctamente.',
            background: '#f0f9ff',
            color: '#1e293b',
            iconColor: '#2563eb',
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: 'rounded-2xl shadow-lg',
              title: 'font-bold',
              icon: 'border-4 border-blue-200'
            }
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear la traducción.',
            background: '#fff1f2',
            color: '#991b1b',
            iconColor: '#dc2626',
            customClass: {
              popup: 'rounded-2xl shadow-lg',
              title: 'font-bold',
              icon: 'border-4 border-red-200'
            }
          });
          console.error('Error creating translation:', error);
        }
      });
    }
  }

  loadActiveTranslations(): void {
    this.translationService.getActiveTranslations().subscribe({
      next: (translations) => this.translations = translations,
      error: (error) => console.error('Error loading active translations:', error)
    });
  }

  loadInactiveTranslations(): void {
    this.translationService.getInactiveTranslations().subscribe({
      next: (translations) => this.translations = translations,
      error: (error) => console.error('Error loading inactive translations:', error)
    });
  }

  loadAllTranslations(): void {
    this.translationService.getAllTranslations().subscribe({
      next: (translations) => this.translations = translations,
      error: (error) => console.error('Error loading all translations:', error)
    });
  }

  // Iniciar edición
  editTranslation(translation: Translation): void {
    this.editingId = translation.id!;
    this.editingSourceText = translation.sourceText;
    this.editingTranslatedText = translation.translatedText;
    this.editingSourceLanguage = translation.sourceLanguage;
    this.editingTargetLanguage = translation.targetLanguage;
  }

  // Guardar edición
  saveEdit(translation: Translation): void {
    const updated: Partial<Translation> = {
      sourceText: this.editingSourceText,
      translatedText: this.editingTranslatedText,
      sourceLanguage: this.editingSourceLanguage,
      targetLanguage: this.editingTargetLanguage
    };
    this.translationService.updateTranslation(translation.id!, updated).subscribe({
      next: (updatedTranslation) => {
        const idx = this.translations.findIndex(t => t.id === translation.id);
        if (idx !== -1) {
          this.translations[idx] = updatedTranslation;
        }
        this.cancelEdit();
        Swal.fire({
          icon: 'success',
          title: '¡Actualizado!',
          text: 'La traducción se actualizó correctamente.',
          background: '#f0fdf4',
          color: '#166534',
          iconColor: '#22c55e',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            title: 'font-bold',
            icon: 'border-4 border-green-200'
          }
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la traducción.',
          background: '#fff1f2',
          color: '#991b1b',
          iconColor: '#dc2626',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            title: 'font-bold',
            icon: 'border-4 border-red-200'
          }
        });
        console.error('Error updating translation:', error);
      }
    });
  }

  // Cancelar edición
  cancelEdit(): void {
    this.editingId = null;
    this.editingSourceText = '';
    this.editingTranslatedText = '';
    this.editingSourceLanguage = 'en';
    this.editingTargetLanguage = 'es';
  }

  deleteTranslation(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      background: '#fefce8',
      color: '#713f12',
      iconColor: '#facc15',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-2xl shadow-lg',
        title: 'font-bold',
        icon: 'border-4 border-yellow-200',
        confirmButton: 'text-blue-700 font-semibold bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded',
        cancelButton: 'text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.translationService.deleteTranslation(id).subscribe({
          next: () => {
            this.translations = this.translations.filter(t => t.id !== id);
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'La traducción fue eliminada.',
              background: '#f0f9ff',
              color: '#1e293b',
              iconColor: '#2563eb',
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: 'rounded-2xl shadow-lg',
                title: 'font-bold',
                icon: 'border-4 border-blue-200'
              }
            });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la traducción.',
              background: '#fff1f2',
              color: '#991b1b',
              iconColor: '#dc2626',
              customClass: {
                popup: 'rounded-2xl shadow-lg',
                title: 'font-bold',
                icon: 'border-4 border-red-200'
              }
            });
            console.error('Error deleting translation:', error);
          }
        });
      }
    });
  }

  restoreTranslation(id: string): void {
    this.translationService.restoreTranslation(id).subscribe({
      next: (translation) => {
        const index = this.translations.findIndex(t => t.id === id);
        if (index !== -1) {
          this.translations[index] = translation;
        }
        Swal.fire({
          icon: 'success',
          title: '¡Restaurado!',
          text: 'La traducción fue restaurada.',
          background: '#f0fdf4',
          color: '#166534',
          iconColor: '#22c55e',
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            title: 'font-bold',
            icon: 'border-4 border-green-200'
          }
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo restaurar la traducción.',
          background: '#fff1f2',
          color: '#991b1b',
          iconColor: '#dc2626',
          customClass: {
            popup: 'rounded-2xl shadow-lg',
            title: 'font-bold',
            icon: 'border-4 border-red-200'
          }
        });
        console.error('Error restoring translation:', error);
      }
    });
  }
} 