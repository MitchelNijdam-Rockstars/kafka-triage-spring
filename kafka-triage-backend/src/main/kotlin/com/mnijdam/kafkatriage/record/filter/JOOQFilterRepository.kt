package com.mnijdam.kafkatriage.record.filter

import com.mnijdam.kafkatriage.record.Header
import com.mnijdam.kafkatriage.record.Record
import com.mnijdam.kafkatriage.record.RecordFilter
import com.mnijdam.kafkatriage.record.RecordFilter.FilterOperation.*
import jooq.generated.kt.Tables.HEADER
import jooq.generated.kt.Tables.RECORD
import jooq.generated.kt.tables.records.RecordRecord
import org.jooq.*
import org.jooq.impl.DSL.field
import org.jooq.impl.DSL.name
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Direction
import org.springframework.stereotype.Repository


@Repository
class JOOQFilterRepository(private val jooqDsl: DSLContext) : FilterRepository {

    override fun getRecordPage(
        filters: List<RecordFilter>,
        pageable: Pageable
    ): Page<Record> {
        val query = jooqDsl.selectFrom(RECORD)

        for (filter in filters) {
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
        val count = jooqDsl.fetchCount(query)
        if (count == 0) {
            return PageImpl(emptyList(), pageable, 0)
        }

        sortingAndPagination(query, pageable)

        val records = query.fetchInto(JooqRecord::class.java)
        val headers = fetchHeaders(records.map { it.id!! })

        val result = records.map { it.toRecord(headers) }

        return PageImpl(result, pageable, count.toLong())
    }

    private fun sortingAndPagination(
        query: SelectWhereStep<RecordRecord>,
        pageable: Pageable
    ) {
        val sortFields = getSortFields(pageable.sort)
        query
            .orderBy(sortFields)
            .limit(pageable.pageSize)
            .offset(pageable.offset)
    }

    private fun getSortFields(sort: Sort?): List<SortField<*>> {
        return sort?.map { field ->
            val tableField = field(name(field.property))
            val direction = field.direction
            convertTableFieldToSortField(tableField, direction)
        }?.toList() ?: emptyList()
    }

    private fun convertTableFieldToSortField(field: Field<*>, sortDirection: Direction): SortField<*> {
        return if (sortDirection == Direction.ASC) {
            field.asc()
        } else {
            field.desc()
        }
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

    private fun fetchHeaders(recordIds: List<Long>): List<JooqHeader> {
        return jooqDsl.select(
            HEADER.ID,
            HEADER.KEY,
            HEADER.VALUE,
            HEADER.NATIVE,
            HEADER.RECORD_ID.`as`("recordId")
        ).from(HEADER).where(HEADER.RECORD_ID.`in`(recordIds)).fetchInto(JooqHeader::class.java)
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