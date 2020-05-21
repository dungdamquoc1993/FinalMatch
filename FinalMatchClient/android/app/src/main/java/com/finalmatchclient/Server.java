package com.finalmatchclient;

import org.jetbrains.annotations.NotNull;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class Server {
    private static final String  PORT = "3001";
    private static final String  SERVER = "150.95.113.87:"+PORT;
    private static final String  URL_INSERT_HASHKEY = "http://"+SERVER+"/temp/insertHashKey";
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
            RequestBody formBody = new FormBody.Builder()
                    .add("content", hashKey)
                    .add("locale", "en")
                    .build();
            Request request = new Request.Builder()
                    .url(URL_INSERT_HASHKEY)
                    .post(formBody)
                    .build();
            Call call = client.newCall(request);
            Callback callback = new Callback() {
                @Override
                public void onFailure(@NotNull Call call, @NotNull IOException e) {
                    System.err.println(e);
                }

                @Override
                public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                    System.out.println("success");
                }
            };
            call.enqueue(callback);

        } catch (Exception e) {
            System.err.println("Cannot send data to server");
            e.printStackTrace();
        }

    }
}
