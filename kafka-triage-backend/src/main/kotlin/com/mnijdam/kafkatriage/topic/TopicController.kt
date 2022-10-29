package com.mnijdam.kafkatriage.topic

import com.mnijdam.kafkatriage.record.RecordRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/topics")
class TopicController(private val recordRepository: RecordRepository) {

    @GetMapping("/")
    fun list(): List<Topic> {
        return recordRepository.listTopics()
    }
}