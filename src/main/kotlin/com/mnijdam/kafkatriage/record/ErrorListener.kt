package com.mnijdam.kafkatriage.record

import kotlinx.coroutines.runBlocking
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.kafkatriage.records.Record.Companion.fromConsumerRecord
import org.slf4j.LoggerFactory.getLogger
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
class ErrorListener(val recordRepository: RecordRepository) {
    private val logger = getLogger(ErrorListener::class.java)

    @KafkaListener(topicPattern = "^.+\\.DLT")
    fun <K, V> listen(message: ConsumerRecord<K, V>) {
        runBlocking {
            logger.info("Received message: $message")
            val record = fromConsumerRecord(message)
            recordRepository.save(record)
        }
    }
}