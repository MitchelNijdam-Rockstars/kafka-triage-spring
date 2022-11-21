package com.mnijdam.kafkatriage.record

import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

@Service
class RecordFilterService(private val recordRepository: RecordRepository) {

    fun getRecordPage(recordRequest: RecordFilter): Page<Record> {
        TODO("Not yet implemented")
    }
}
