package com.mnijdam.kafkatriage.replay

import com.mnijdam.kafkatriage.record.Header
import com.mnijdam.kafkatriage.record.Record
import com.mnijdam.kafkatriage.record.RecordRepository
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.clients.producer.RecordMetadata
import org.springframework.cloud.stream.binder.EmbeddedHeaderUtils
import org.springframework.cloud.stream.binder.MessageValues
import org.springframework.messaging.MessageHeaders
import org.springframework.messaging.support.GenericMessage
import org.springframework.stereotype.Service
import java.util.concurrent.Future

@Service
class ReplayService(
    private val recordRepository: RecordRepository,
    private val kafkaProducer: KafkaProducer<String, ByteArray>
) {

    /**
     * Replay the records with the given ids to the retry topic.
     *
     * Potential outcomes:
     * - records produced on retry topic, DB updated with triaged=true and replayedOffset; all good
     * - for some DB records triaged=true && replayedOffset=null; need to review exceptions
     *  and verify if the records were in fact replayed
     */
    fun replay(ids: List<Long>): ReplayResult {
        val headersToIgnoreRegex = Regex("^kafka_dlt-.*")
        val recordsToReplay = recordRepository.findAllByIdUntriaged(ids)
        recordRepository.markTriaged(ids)

        val sendFutures = replayRecords(recordsToReplay, headersToIgnoreRegex)

        return determineReplayResult(sendFutures, recordsToReplay)

    }

    private fun replayRecords(
        recordsToReplay: List<Record>,
        headersToIgnoreRegex: Regex
    ): ArrayList<Future<RecordMetadata>> {
        val sendFutures = ArrayList<Future<RecordMetadata>>(recordsToReplay.size)
        for (i in recordsToReplay.indices) {
            val record = recordsToReplay[i]
            val headers = record.headers
                .filterNot { headersToIgnoreRegex.containsMatchIn(it.key) }

            val retryTopic = record.topic.replace(Regex("\\.DLT$"), ".RETRY")

            val value: ByteArray?
            val nativeHeaders: List<org.apache.kafka.common.header.Header>
            if (headers.isNotEmpty() && headers.all { !it.native }) {
                // this is awkward to use
                val messageValues =
                    MessageValues(
                        GenericMessage(
                            record.value?.toByteArray() ?: ByteArray(0),
                            MessageHeaders(headers.associateBy({ it.key }, { it.value }))
                        )
                    )
                value = EmbeddedHeaderUtils.embedHeaders(
                    messageValues,
                    *headers.map { it.key }.toTypedArray()
                )
                nativeHeaders = listOf()
            } else {
                value = record.value?.toByteArray()
                nativeHeaders = headers.map(Header::toKafkaHeader)
            }
            val producerRecord = ProducerRecord(
                retryTopic, 0, record.timestamp, record.key, value,
                nativeHeaders
            )
            sendFutures.add(i, kafkaProducer.send(producerRecord))
        }
        return sendFutures
    }

    private fun determineReplayResult(
        sendFutures: ArrayList<Future<RecordMetadata>>,
        recordsToReplay: List<Record>
    ): ReplayResult {
        val replayed = mutableListOf<ReplayResult.ReplayedRecord>()
        val errors = mutableListOf<ReplayResult.RecordWithError>()
        for (i in sendFutures.indices) {
            val record = recordsToReplay[i]
            try {
                val metadata = sendFutures[i].get()
                if (metadata.hasOffset()) {
                    val replayedOffset = metadata.offset()
                    recordRepository.setReplayedOffset(record.id!!, replayedOffset)
                    replayed.add(ReplayResult.ReplayedRecord(record.offset, replayedOffset))
                }

            } catch (ex: Exception) {
                errors.add(ReplayResult.RecordWithError(record.offset, ex))
            }
        }
        recordRepository.flush()
        return ReplayResult(replayed, errors)
    }
}