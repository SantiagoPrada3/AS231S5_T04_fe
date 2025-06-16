package pe.edu.vallegrande.deeptraslate.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pe.edu.vallegrande.deeptraslate.model.Translation;
import pe.edu.vallegrande.deeptraslate.repository.TranslationRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TranslationService {

    private final TranslationRepository translationRepository;
    private final WebClient webClient;

    public Mono<Translation> translate(String text, String sourceLang, String targetLang) {
        return webClient.post()
                .uri("https://deep-translate1.p.rapidapi.com/language/translate/v2")
                .header("x-rapidapi-key", "671b50a122mshaf9764da7d7739cp172a75jsna75ff1f66e9b")
                .header("x-rapidapi-host", "deep-translate1.p.rapidapi.com")
                .header("Content-Type", "application/json")
                .bodyValue(new TranslationRequest(text, sourceLang, targetLang))
                .retrieve()
                .bodyToMono(TranslationResponse.class)
                .flatMap(response -> {
                    Translation translation = new Translation();
                    translation.setSourceText(text);
                    translation.setTranslatedText(response.getData().getTranslations().getTranslatedText());
                    translation.setSourceLanguage(sourceLang);
                    translation.setTargetLanguage(targetLang);
                    translation.setCreatedAt(LocalDateTime.now());
                    return translationRepository.save(translation);
                });
    }

    private record TranslationRequest(String q, String source, String target) {
    }

    private record TranslationResponse(Data data) {
        public Data getData() {
            return data;
        }
    }

    private record Data(Translations translations) {
        public Translations getTranslations() {
            return translations;
        }
    }

    private record Translations(List<String> translatedText) {
        public String getTranslatedText() {
            return translatedText != null && !translatedText.isEmpty() ? translatedText.get(0) : "";
        }
    }

    public Flux<Translation> findAllActive() {
        return translationRepository.findAllByStatus("ACTIVE");
    }

    public Flux<Translation> findAllInactive() {
        return translationRepository.findAllByStatus("INACTIVE");
    }

    public Mono<Translation> findById(String id) {
        return translationRepository.findById(id);
    }

    public Mono<Translation> update(String id, Translation updated) {
        return translationRepository.findById(id)
                .flatMap(existing -> {
                    // Obtener la traducción pero no guardar el nuevo documento
                    return webClient.post()
                            .uri("https://deep-translate1.p.rapidapi.com/language/translate/v2")
                            .header("x-rapidapi-key", "671b50a122mshaf9764da7d7739cp172a75jsna75ff1f66e9b")
                            .header("x-rapidapi-host", "deep-translate1.p.rapidapi.com")
                            .header("Content-Type", "application/json")
                            .bodyValue(new TranslationRequest(updated.getSourceText(),
                                    updated.getSourceLanguage(),
                                    updated.getTargetLanguage()))
                            .retrieve()
                            .bodyToMono(TranslationResponse.class)
                            .flatMap(response -> {
                                // Actualizar el documento existente
                                existing.setSourceText(updated.getSourceText());
                                existing.setTranslatedText(response.getData().getTranslations().getTranslatedText());
                                existing.setSourceLanguage(updated.getSourceLanguage());
                                existing.setTargetLanguage(updated.getTargetLanguage());
                                existing.setStatus(updated.getStatus());
                                return translationRepository.save(existing);
                            });
                });
    }

    public Mono<Void> logicalDelete(String id) {
        return translationRepository.findById(id)
                .flatMap(existing -> {
                    existing.setStatus("INACTIVE");
                    return translationRepository.save(existing);
                })
                .then();
    }

    public Mono<Translation> restore(String id) {
        return translationRepository.findById(id)
                .flatMap(existing -> {
                    existing.setStatus("ACTIVE");
                    return translationRepository.save(existing);
                });
    }

    public Flux<Translation> findAll() {
        return translationRepository.findAll();
    }
}