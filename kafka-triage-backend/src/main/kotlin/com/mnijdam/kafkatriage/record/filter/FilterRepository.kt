package com.mnijdam.kafkatriage.record.filter

import com.mnijdam.kafkatriage.record.Record
import com.mnijdam.kafkatriage.record.RecordFilterRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest

interface FilterRepository {
    fun getRecordPage(filter: RecordFilterRequest, page: PageRequest): Page<Record>
}