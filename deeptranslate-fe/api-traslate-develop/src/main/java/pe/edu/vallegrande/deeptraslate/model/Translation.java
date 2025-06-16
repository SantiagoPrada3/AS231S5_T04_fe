package pe.edu.vallegrande.deeptraslate.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "traduction")
public class Translation {
    @Id
    private String id;
    private String sourceText;
    private String translatedText;
    private String sourceLanguage;
    private String targetLanguage;
    private LocalDateTime createdAt;
    private String status = "ACTIVE";
}