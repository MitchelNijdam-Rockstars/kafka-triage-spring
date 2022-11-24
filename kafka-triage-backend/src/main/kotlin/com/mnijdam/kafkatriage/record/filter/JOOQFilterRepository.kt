package com.mnijdam.kafkatriage.record.filter

import com.mnijdam.kafkatriage.record.Header
import com.mnijdam.kafkatriage.record.Record
import com.mnijdam.kafkatriage.record.RecordFilter
import com.mnijdam.kafkatriage.record.RecordFilter.FilterOperation.*
import com.mnijdam.kafkatriage.record.RecordFilterRequest
import jooq.generated.kt.Tables.HEADER
import jooq.generated.kt.Tables.RECORD
import jooq.generated.kt.tables.records.RecordRecord
import org.jooq.Condition
import org.jooq.DSLContext
import org.jooq.TableField
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Repository

@Repository
class JOOQFilterRepository(private val jooqDsl: DSLContext) : FilterRepository {

    override fun getRecordPage(
        filterRequest: RecordFilterRequest,
        page: PageRequest
    ): Page<Record> {
        val query = jooqDsl.selectFrom(RECORD)

        for (filter in filterRequest.filters) {
            val op = filter.operation
            when (filter.key) {
                "topic" -> query.where(createCondition(RECORD.TOPIC, op, filter.value))
                "partition" -> query.where(createCondition(RECORD.PARTITION, op, filter.value.toInt()))
                "offset" -> query.where(createCondition(RECORD.OFFSET, op, filter.value.toLong()))
                "timestamp" -> query.where(createCondition(RECORD.TIMESTAMP, op, filter.value.toLong()))
                "key" -> query.where(createCondition(RECORD.KEY, op, filter.value))
                "value" -> query.where(createCondition(RECORD.VALUE, op, filter.value))
                "triaged" -> query.where(createCondition(RECORD.TRIAGED, op, filter.value.toBoolean()))
            }
        }

        // TODO: pagination & sorting
        val records = query.fetchInto(JooqRecord::class.java).map { it.toRecord(emptyList()) }

        // TODO: fetch records
        return PageImpl(records, page, records.size.toLong())
    }

    private fun <T : Any> createCondition(
        field: TableField<RecordRecord, T>,
        operation: RecordFilter.FilterOperation,
        value: T
    ): Condition {
        return when (operation) {
            EQUALS -> field.eq(value)
            NOT_EQUALS -> field.ne(value)
            GREATER_THAN -> field.gt(value)
            GREATER_THAN_OR_EQUAL -> field.ge(value)
            LESS_THAN -> field.lt(value)
            LESS_THAN_OR_EQUAL -> field.le(value)
            REGEX -> field.likeRegex(value.toString())
        }
    }

    private fun fetchHeaders(): List<JooqHeader> {
        return jooqDsl.select(
            HEADER.ID,
            HEADER.KEY,
            HEADER.VALUE,
            HEADER.NATIVE,
            HEADER.RECORD_ID.`as`("recordId")
        ).from(HEADER).fetchInto(JooqHeader::class.java)
    }
}

private data class JooqRecord(
    val topic: String,
    val partition: Int,
    val offset: Long,
    val timestamp: Long? = null,
    val key: String?,
    val value: String?,
    var triaged: Boolean = false,
    var replayedOffset: Long? = null,
    val id: Long? = null
) {
    fun toRecord(headers: List<JooqHeader>): Record {
        return Record(
            topic,
            partition,
            offset,
            timestamp,
            key,
            value,
            headers.map { it.toHeader() },
            triaged,
            replayedOffset,
            id
        )
    }
}

private data class JooqHeader(
    val key: String,
    val value: String,
    val native: Boolean,
    val id: Long? = null,
    val recordId: Long? = null
) {
    fun toHeader(): Header {
        return Header(key, value, native, id)
    }
}