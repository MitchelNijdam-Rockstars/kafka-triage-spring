package com.mnijdam.kafkatriage.record

import com.mnijdam.kafkatriage.replay.ReplayService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/records")
class RecordController(
    private val recordRepository: RecordRepository,
    private val replayService: ReplayService
) {

    @GetMapping
    fun getRecords(@RequestParam(required = false) topic: String?): List<Record> {
        return if (topic == null) {
            recordRepository.findAll()
        } else {
            recordRepository.findByTopic(topic)
        }
    }

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