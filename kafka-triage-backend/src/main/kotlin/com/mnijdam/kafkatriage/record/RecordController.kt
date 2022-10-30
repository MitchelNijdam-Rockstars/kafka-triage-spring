package com.mnijdam.kafkatriage.record

import com.mnijdam.kafkatriage.replay.ReplayService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/records")
class RecordController(
    private val recordRepository: RecordRepository,
    private val replayService: ReplayService
) {

    @GetMapping("/")
    fun getRecords(): List<Record> = recordRepository.findAll()

    @PostMapping("/discard")
    fun discardRecords(@RequestBody ids: List<Long>): Boolean {
        recordRepository.markTriaged(ids)
        return true
    }

    @PostMapping("/replay")
    fun replayRecords(@RequestBody ids: List<Long>): Boolean {
        replayService.replay(ids)
        return true
    }
}