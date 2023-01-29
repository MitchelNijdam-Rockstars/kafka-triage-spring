package com.mnijdam.kafkatriage.record.filter

import com.dbobjekts.api.ResultRow1
import com.dbobjekts.api.TransactionManager
import com.dbobjekts.metadata.column.Column
import com.dbobjekts.statement.select.SelectStatementExecutor
import com.dbobjekts.statement.whereclause.SubClause
import com.mnijdam.kafkatriage.bdobjekts.public.RecordRow
import com.mnijdam.kafkatriage.record.Record
import com.mnijdam.kafkatriage.record.RecordFilter
import com.mnijdam.kafkatriage.record.RecordFilter.FilterOperation
import com.mnijdam.kafkatriage.record.RecordFilter.FilterOperation.*
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import com.mnijdam.kafkatriage.bdobjekts.public.Record as ObjektsRecord

@Repository
class DbObjektsFilterRepository(private val tm: TransactionManager) : FilterRepository {

    override fun getRecordPage(filters: List<RecordFilter>, pageable: Pageable): Page<Record> {
        val result = tm.newTransaction {
            val query = it.select(ObjektsRecord)

            filtering(filters, query)
            sortingAndPagination(query, pageable)

            query.asList()
        }

        val records = result.map {
            Record(
                it.topic,
                it.partition,
                it.offset,
                it.timestamp,
                it.key,
                it.value,
                emptyList(),
                it.triaged
            )
        }
        return PageImpl(records, pageable, result.size.toLong())
    }

    private fun filtering(
        filters: List<RecordFilter>,
        query: SelectStatementExecutor<RecordRow, ResultRow1<RecordRow>>
    ) {
        for (filter in filters) {
            val op = filter.operation
            when (filter.key) {
                "topic" -> query.where(createCondition(ObjektsRecord.topic, op, filter.value))
                "partition" -> query.where(createCondition(ObjektsRecord.partition, op, filter.value.toInt()))
                "offset" -> query.where(createCondition(ObjektsRecord.offset, op, filter.value.toLong()))
                "timestamp" -> query.where(createCondition(ObjektsRecord.timestamp, op, filter.value.toLong()))
                "key" -> query.where(createCondition(ObjektsRecord.key, op, filter.value))
                "value" -> query.where(createCondition(ObjektsRecord.value, op, filter.value))
                "triaged" -> query.where(createCondition(ObjektsRecord.triaged, op, filter.value.toBoolean()))
            }
        }
    }

    private fun sortingAndPagination(
        query: SelectStatementExecutor<RecordRow, ResultRow1<RecordRow>>,
        pageable: Pageable
    ) {
        val sort = pageable.sort

        sort.forEach {
            val column = toColumn(it.property)
            if (it.isAscending) {
                query.orderAsc(column)
            } else {
                query.orderDesc(column)
            }
        }
        query.limit(pageable.pageSize)
        //.offset(pageable.offset) // TODO: not supported by dbobjekts yet
    }

    private fun <T : Any?> createCondition(
        field: Column<T>,
        operation: FilterOperation,
        value: T
    ): SubClause {
        return when (operation) {
            EQUALS -> field.eq(value)
            NOT_EQUALS -> field.ne(value)
            GREATER_THAN -> field.gt(value)
            GREATER_THAN_OR_EQUAL -> field.ge(value)
            LESS_THAN -> field.lt(value)
            LESS_THAN_OR_EQUAL -> field.le(value)
            REGEX -> field.contains(value.toString()) // TODO: Should be regex, not supported by dbobjekts yet
        }
    }

    private fun toColumn(field: String): Column<out Any?> {
        return when (field) {
            "topic" -> ObjektsRecord.topic
            "partition" -> ObjektsRecord.partition
            "offset" -> ObjektsRecord.offset
            "timestamp" -> ObjektsRecord.timestamp
            "key" -> ObjektsRecord.key
            "value" -> ObjektsRecord.value
            "triaged" -> ObjektsRecord.triaged
            else -> throw IllegalArgumentException("Unknown field: $field")
        }
    }
}