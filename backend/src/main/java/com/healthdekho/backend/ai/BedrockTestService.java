package com.healthdekho.backend.ai;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class BedrockTestService {

    private final ChatClient chatClient;

    public BedrockTestService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String testConnection() {

        return chatClient.prompt()
                .user("Reply with exactly: HealthDekho Bedrock connection successful")
                .call()
                .content();
    }
}