package com.mnijdam.kafkatriage.record

import com.mnijdam.kafkatriage.record.Record.Companion.fromConsumerRecord
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.slf4j.LoggerFactory.getLogger
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
class ErrorListener(private val recordRepository: RecordRepository) {
    private val logger = getLogger(ErrorListener::class.java)

    @KafkaListener(topicPattern = "^.*\\.DLT$")
    fun <K, V> listen(record: ConsumerRecord<K, V>) {
        logger.info("Handling DLQ record: $record")
        recordRepository.save(fromConsumerRecord(record))
    }
}