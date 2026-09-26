package com.realmcheck.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// We will use a quick XML parser logic here instead of pulling a big dependency for a simple RSS feed.
// Usually you'd use Rome, but standard string/regex or simple DOM parsing works for MVP Phase 2.

@RestController
@RequestMapping("/api/rss")
@CrossOrigin(origins = "*")
public class RssController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/fetch")
    public ResponseEntity<List<Map<String, String>>> fetchFeed(@RequestParam String url) {
        List<Map<String, String>> articles = new ArrayList<>();
        try {
            String xml = restTemplate.getForObject(url, String.class);
            if (xml != null) {
                // A very basic parsing logic to extract <item> blocks from XML
                String[] items = xml.split("<item>");
                for (int i = 1; i < items.length; i++) {
                    String itemStr = items[i].split("</item>")[0];
                    
                    Map<String, String> article = new HashMap<>();
                    article.put("title", extractTag(itemStr, "title"));
                    article.put("link", extractTag(itemStr, "link"));
                    article.put("pubDate", extractTag(itemStr, "pubDate"));
                    article.put("description", extractTag(itemStr, "description"));
                    
                    articles.add(article);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(articles);
    }

    private String extractTag(String xml, String tag) {
        try {
            String startTag = "<" + tag + ">";
            String endTag = "</" + tag + ">";
            int start = xml.indexOf(startTag);
            if (start == -1) {
                // Handle CDATA or attributes roughly if basic tag fails, but keep simple
                return "";
            }
            start += startTag.length();
            int end = xml.indexOf(endTag, start);
            if (end == -1) return "";
            
            String content = xml.substring(start, end);
            content = content.replaceAll("<!\\[CDATA\\[", "").replaceAll("\\]\\]>", "");
            return content.trim();
        } catch (Exception e) {
            return "";
        }
    }
}
