package com.mnijdam.kafkatriage.listener

import com.mnijdam.kafkatriage.Record
import com.mnijdam.kafkatriage.RecordRepository
import kotlinx.coroutines.runBlocking
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.slf4j.LoggerFactory.getLogger
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
class ErrorListener(val recordRepository: RecordRepository) {
    private val logger = getLogger(ErrorListener::class.java)

    @KafkaListener(topicPattern = "^.+\\.DLT")
    fun listen(message: ConsumerRecord<String, String>) {
        runBlocking {
            logger.info("Received message: $message")
            val record = Record(null, message.topic())
            recordRepository.save(record)
        }
    }
}