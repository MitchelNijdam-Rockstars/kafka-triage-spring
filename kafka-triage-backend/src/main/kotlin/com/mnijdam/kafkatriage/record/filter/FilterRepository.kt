package com.mnijdam.kafkatriage.record.filter

import com.mnijdam.kafkatriage.record.Record
import com.mnijdam.kafkatriage.record.RecordFilter
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface FilterRepository {
    fun getRecordPage(filters: List<RecordFilter>, pageable: Pageable): Page<Record>
}