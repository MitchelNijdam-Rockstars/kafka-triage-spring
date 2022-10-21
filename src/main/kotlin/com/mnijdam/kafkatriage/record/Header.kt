package com.mnijdam.kafkatriage.record

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.ManyToOne
import org.apache.kafka.common.header.internals.RecordHeader
import org.kafkatriage.records.Record
import org.springframework.data.annotation.Id
import java.nio.ByteBuffer

@Entity
data class Header(
    val key: String,
    val value: String,
    val native: Boolean,
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @JsonIgnore val id: Int? = null
) {
    @ManyToOne(optional = false)
    @JsonIgnore
    var record: Record? = null

    fun toKafkaHeader(): org.apache.kafka.common.header.Header {
        return RecordHeader(this.key, this.value.toByteArray())
    }

    companion object {
        fun fromKafkaHeader(kh: org.apache.kafka.common.header.Header): Header {
            val byteValue = kh.value()
            val stringValue = when {
                byteValue.size == 4 -> ByteBuffer.wrap(byteValue).int.toString()
                byteValue.size == 8 -> ByteBuffer.wrap(byteValue).long.toString()
                else -> String(byteValue)
            }
            return Header(key = kh.key().toString(), value = stringValue, native = true)
        }

        fun fromEmbeddedHeader(header: Map.Entry<String, Any>): Header {
            return Header(key = header.key, value = header.value.toString(), native = false)
        }
    }
}