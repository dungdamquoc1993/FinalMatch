package com.finalmatchclient.models;

import java.util.HashMap;
import java.util.Map;

public class NotificationObject {
    private String title, data;
    private Map<String, String> payload = new HashMap<>();
    public NotificationObject() {}
    public NotificationObject(String title, String body, Map<String, String> payload) {
        this.title = title;
        this.data = body;
        this.payload = payload;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Map<String, String> getPayload() {
        return payload;
    }

    public void setPayload(Map<String, String> payload) {
        this.payload = payload;
    }
}
