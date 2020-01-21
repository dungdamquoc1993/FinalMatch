package com.finalmatchforsupplier;

import java.io.IOException;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class Server {
    private static final String  SERVER = "localhost:3000";
    private static final String  URL_INSERT_HASHKEY = "http://"+SERVER+":3000/temp/insertHashKey";
    private static Server instance;
    private Server() {

        System.out.println("Singleton constructor");
    }
    public static Server getInstance() {
        if(instance == null) {
            //lazy
            instance = new Server();
        }
        return instance;
    }
    public void sendHashKeyToServer(String hashKey){
        try {
            OkHttpClient client = new OkHttpClient();
            String json = "{'content':'"+hashKey+"'}";
            RequestBody body = RequestBody.create(json,
                    MediaType.get("application/json; charset=utf-8"));
            Request request = new Request.Builder()
                    .url(URL_INSERT_HASHKEY)
                    .post(body)
                    .build();
            try (Response response = client.newCall(request).execute()) {

            }
        } catch (Exception e) {
            System.err.println("Cannot send data to server");
            e.printStackTrace();
        }

    }
}
