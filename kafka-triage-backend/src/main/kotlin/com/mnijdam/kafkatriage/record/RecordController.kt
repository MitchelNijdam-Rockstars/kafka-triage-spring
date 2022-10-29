package com.mnijdam.kafkatriage.record

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/records")
class RecordController(private val recordRepository: RecordRepository) {

    @GetMapping("/")
    fun getRecords(): List<Record> = recordRepository.findAll()
}