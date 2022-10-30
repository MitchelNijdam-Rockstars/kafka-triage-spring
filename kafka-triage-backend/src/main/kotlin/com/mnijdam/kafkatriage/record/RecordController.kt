package com.mnijdam.kafkatriage.record

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/records")
class RecordController(private val recordRepository: RecordRepository) {

    @GetMapping("/")
    fun getRecords(): List<Record> = recordRepository.findAll()

    @PostMapping("/discard")
    fun discardRecords(@RequestBody ids: List<Long>): Boolean {
        recordRepository.discard(ids);
        return true
    }
}