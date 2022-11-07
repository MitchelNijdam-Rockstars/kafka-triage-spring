package com.mnijdam.kafkatriage.record

import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

@Service
class RecordService(private val recordRepository: RecordRepository) {

    fun getRecordPage(recordRequest: RecordRequest): Page<Record> {
        val page = recordRequest.toPage()
        return if (recordRequest.topic == null) {
            recordRepository.findAll(page)
        } else {
            recordRepository.findByTopic(recordRequest.topic, page)
        }
    }
}
