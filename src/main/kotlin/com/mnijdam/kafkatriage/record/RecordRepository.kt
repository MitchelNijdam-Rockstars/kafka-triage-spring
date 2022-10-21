package com.mnijdam.kafkatriage.record

import org.kafkatriage.records.Record
import org.springframework.data.jpa.repository.JpaRepository

interface RecordRepository : JpaRepository<Record, String>
