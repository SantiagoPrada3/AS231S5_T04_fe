package pe.edu.vallegrande.deeptraslate.repository;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import pe.edu.vallegrande.deeptraslate.model.Translation;
import reactor.core.publisher.Flux;

public interface TranslationRepository extends ReactiveMongoRepository<Translation, String> {
    Flux<Translation> findAllByStatus(String status);
}