export interface Translation {
    id?: string;
    sourceText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
    createdAt?: Date;
    status?: string;
} 