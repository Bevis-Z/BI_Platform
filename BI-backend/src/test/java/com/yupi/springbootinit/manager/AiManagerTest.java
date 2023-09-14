package com.yupi.springbootinit.manager;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AiManagerTest {
    @Resource
    private AiManager aiManager;

    @Test
    void doChat() {
        String answer = aiManager.doChat(1659171950288818178L,"原始数据：\n" +
                "日期,用户数\n" +
                "1号,10\n" +
                "2号,30\n" +
                "3号,40");
        System.out.println(answer);
    }
}