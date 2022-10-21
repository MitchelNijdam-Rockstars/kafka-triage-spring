package org.kafkatriage.records

import com.fasterxml.jackson.annotation.JsonIgnore
import com.mnijdam.kafkatriage.record.Header
import com.mnijdam.kafkatriage.record.Header.Companion.fromEmbeddedHeader
import com.mnijdam.kafkatriage.record.Header.Companion.fromKafkaHeader
import jakarta.persistence.*
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.springframework.cloud.stream.binder.EmbeddedHeaderUtils
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import org.springframework.messaging.support.GenericMessage

@Entity
@Table("record")
data class Record(
    val topic: String,
    val partition: Int,
    @Column(value = "\"offset\"") val offset: Long,
    val timestamp: Long? = null,
    val key: String?,
    val value: String?,

    @OneToMany(
        mappedBy = "record",
        cascade = [CascadeType.ALL]
    ) val headers: List<Header> = listOf(),

    var triaged: Boolean = false,
    var replayedOffset: Long? = null,
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @JsonIgnore val id: Int? = null
) {

    companion object {
        fun <K, V> fromConsumerRecord(cr: ConsumerRecord<K, V>): Record {
            val value = cr.value() as? ByteArray?
            var embeddedHeaders: List<Header> = listOf()
            var embeddedPayload: ByteArray? = null
            if (value != null && EmbeddedHeaderUtils.mayHaveEmbeddedHeaders(value)) {
                try {
                    // why does it have to be private?
                    val springMessage = GenericMessage<ByteArray>(value)
                    val messageValues = EmbeddedHeaderUtils.extractHeaders(springMessage, false)
                    embeddedHeaders = messageValues.headers.map(::fromEmbeddedHeader)
                    embeddedPayload = messageValues.payload as? ByteArray
                } catch (_: Exception) {
                    // it's ok if we cannot decode them, maybe there aren't any
                }
            }
            val nativeHeaders = cr.headers().map(::fromKafkaHeader)
            val valueAsString = when {
                embeddedPayload != null -> String(embeddedPayload)
                value != null -> String(value)
                else -> null
            }
            val allHeaders = nativeHeaders.plus(embeddedHeaders)
            val record = Record(
                topic = cr.topic(), partition = cr.partition(), offset = cr.offset(),
                timestamp = cr.timestamp(),
                key = cr.key()?.toString(),
                value = valueAsString,
                headers = allHeaders
            )
            allHeaders.forEach { it.record = record }
            return record
        }
    }
}
