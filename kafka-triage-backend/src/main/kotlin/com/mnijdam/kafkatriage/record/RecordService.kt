package com.mnijdam.kafkatriage.record

import com.mnijdam.kafkatriage.record.filter.RecordFilterService
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

@Service
class RecordService(
    private val recordRepository: RecordRepository,
    private val recordFilterService: RecordFilterService
) {

    fun getRecordPage(recordRequest: RecordRequest): Page<Record> {
        val page = recordRequest.toPage()
        return if (recordRequest.topic == null) {
            recordRepository.findAll(page)
        } else {
            recordRepository.findByTopic(recordRequest.topic, page)
        }
    }

    fun getRecordPage(recordRequest: RecordFilterRequest): Page<Record> {
        return recordFilterService.getRecordPage(recordRequest)
    }
}
