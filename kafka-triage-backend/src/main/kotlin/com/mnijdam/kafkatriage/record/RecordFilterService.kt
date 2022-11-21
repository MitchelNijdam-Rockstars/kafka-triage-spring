package com.mnijdam.kafkatriage.record

import jooq.generated.kt.Tables.RECORD
import org.jooq.DSLContext
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@Service
class RecordFilterService(private val recordRepository: RecordRepository, private val dsl: DSLContext) {

    fun getRecordPage(recordRequest: RecordFilterRequest): Page<Record> {
        val result =  dsl.select(RECORD.OFFSET, RECORD.TOPIC)
            .from(RECORD)
            .where(RECORD.TOPIC.eq(recordRequest.filters.find { it.key == "topic" }?.value))
            .fetch()

        println(result)

        return recordRepository.findAll(PageRequest.of(0, 10))
    }
}
