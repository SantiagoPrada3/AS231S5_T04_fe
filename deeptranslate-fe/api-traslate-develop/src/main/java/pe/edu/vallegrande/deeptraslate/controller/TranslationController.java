package pe.edu.vallegrande.deeptraslate.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.deeptraslate.model.Translation;
import pe.edu.vallegrande.deeptraslate.service.TranslationService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/translate")
@RequiredArgsConstructor
public class TranslationController {

    private final TranslationService translationService;

    @GetMapping
    public Mono<Translation> translateGet(
            @RequestParam String text,
            @RequestParam(defaultValue = "en") String sourceLang,
            @RequestParam(defaultValue = "es") String targetLang) {
        return translationService.translate(text, sourceLang, targetLang);
    }

    @PostMapping
    public Mono<Translation> translatePost(@RequestBody TranslationRequest request) {
        return translationService.translate(request.text(), request.sourceLang(), request.targetLang());
    }

    @GetMapping("/active")
    public Flux<Translation> getActive() {
        return translationService.findAllActive();
    }

    @GetMapping("/inactive")
    public Flux<Translation> getInactive() {
        return translationService.findAllInactive();
    }

    @GetMapping("/{id}")
    public Mono<Translation> getById(@PathVariable String id) {
        return translationService.findById(id);
    }

    @PutMapping("/{id}")
    public Mono<Translation> update(@PathVariable String id, @RequestBody Translation request) {
        return translationService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public Mono<Void> logicalDelete(@PathVariable String id) {
        return translationService.logicalDelete(id);
    }

    @PatchMapping("/{id}/restore")
    public Mono<Translation> restore(@PathVariable String id) {
        return translationService.restore(id);
    }

    @GetMapping("/all")
    public Flux<Translation> getAll() {
        return translationService.findAll();
    }

    private record TranslationRequest(String text, String sourceLang, String targetLang) {
    }
}