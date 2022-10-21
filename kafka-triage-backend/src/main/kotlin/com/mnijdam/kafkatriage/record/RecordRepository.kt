package com.mnijdam.kafkatriage.record

import org.springframework.data.jpa.repository.JpaRepository

interface RecordRepository: JpaRepository<Record, Long>