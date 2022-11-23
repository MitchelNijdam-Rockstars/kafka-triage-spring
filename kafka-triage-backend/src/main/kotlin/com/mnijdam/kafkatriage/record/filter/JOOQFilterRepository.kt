package com.mnijdam.kafkatriage.record.filter

import com.mnijdam.kafkatriage.record.Header
import com.mnijdam.kafkatriage.record.Record
import com.mnijdam.kafkatriage.record.RecordFilterRequest
import jooq.generated.kt.Tables.HEADER
import jooq.generated.kt.Tables.RECORD
import org.jooq.DSLContext
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Repository

@Repository
class JOOQFilterRepository(private val jooqDsl: DSLContext) : FilterRepository {

    override fun getRecordPage(filter: RecordFilterRequest, page: PageRequest): Page<Record> {
        val recordResult = jooqDsl.selectFrom(RECORD).fetchInto(JooqRecord::class.java)
        val headerResult = jooqDsl.select(
            HEADER.ID,
            HEADER.KEY,
            HEADER.VALUE,
            HEADER.NATIVE,
            HEADER.RECORD_ID.`as`("recordId")
        ).from(HEADER).fetchInto(JooqHeader::class.java)

        val records = recordResult.map { record ->
            record.toRecord(headerResult.filter { header -> header.recordId == record.id })
        }

        return PageImpl(records, page, records.size.toLong())
    }

    /*private fun exampleTODOremove(recordRequest: RecordFilterRequest): Result<Record2<Long, String>> {
        val result = jooqDsl.select(Tables.RECORD.OFFSET, Tables.RECORD.TOPIC).from(Tables.RECORD)
            .where(Tables.RECORD.TOPIC.eq(recordRequest.filters.find { it.key == "topic" }?.value))
            .fetch()
        println(result)
        return result
    }*/
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