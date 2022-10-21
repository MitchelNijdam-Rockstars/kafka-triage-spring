package com.mnijdam.kafkatriage.record

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class RecordController(private val recordRepository: RecordRepository) {

    @GetMapping("/records")
    fun getRecords(): List<Record> = recordRepository.findAll()
}