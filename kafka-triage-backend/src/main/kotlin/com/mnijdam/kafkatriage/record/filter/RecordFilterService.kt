package com.mnijdam.kafkatriage.record.filter

import com.mnijdam.kafkatriage.record.Record
import com.mnijdam.kafkatriage.record.RecordFilterRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@Service
class RecordFilterService(
    private val filterRepository: FilterRepository
) {

    fun getRecordPage(recordRequest: RecordFilterRequest): Page<Record> {
        return filterRepository.getRecordPage(recordRequest, PageRequest.of(0, 10))
    }
}
