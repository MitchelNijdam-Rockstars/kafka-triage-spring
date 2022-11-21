package com.mnijdam.kafkatriage.record

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

    fun getRecordPage(recordRequest: RecordFilter): Page<Record> {
        return recordFilterService.getRecordPage(recordRequest)
    }
}
