package com.realmcheck.backend.util;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Set;
import static org.assertj.core.api.Assertions.assertThat;

class KeywordUtilTest {

    @Test
    void parseValidAdzunaJson_returnsJobNodes() {
        String json = "{\"results\":[{\"title\":\"Java Dev\",\"company\":\"Acme\",\"location\":\"Toronto\",\"redirect_url\":\"http://example.com\"}]}";
        List<JsonNode> nodes = KeywordUtil.parseAdzunaResults(json);
        assertThat(nodes).hasSize(1);
        JsonNode job = nodes.get(0);
        assertThat(job.path("title").asText()).isEqualTo("Java Dev");
    }

    @Test
    void parseEmptyResults_returnsEmptyList() {
        String json = "{\"results\":[]}";
        List<JsonNode> nodes = KeywordUtil.parseAdzunaResults(json);
        assertThat(nodes).isEmpty();
    }

    @Test
    void parseMalformedJson_returnsEmptyList() {
        String json = "not a json";
        List<JsonNode> nodes = KeywordUtil.parseAdzunaResults(json);
        assertThat(nodes).isEmpty();
    }

    @Test
    void extractMatchedTerms_findsCaseInsensitiveMatches() {
        Set<String> keywords = Set.of("java", "spring");
        String text = "Senior Java Developer using Spring Framework";
        List<String> matched = KeywordUtil.extractMatchedTerms(keywords, text);
        assertThat(matched).containsExactlyInAnyOrder("java", "spring");
    }

    @Test
    void extractMatchedTerms_noMatches_returnsEmpty() {
        Set<String> keywords = Set.of("python");
        String text = "Java Developer";
        List<String> matched = KeywordUtil.extractMatchedTerms(keywords, text);
        assertThat(matched).isEmpty();
    }
}
