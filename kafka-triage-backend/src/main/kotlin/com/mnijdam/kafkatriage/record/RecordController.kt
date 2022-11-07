package com.mnijdam.kafkatriage.record

import com.mnijdam.kafkatriage.replay.ReplayService
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/records")
class RecordController(
    private val recordRepository: RecordRepository,
    private val recordService: RecordService,
    private val replayService: ReplayService
) {

    @GetMapping
    fun getRecords(recordRequest: RecordRequest = RecordRequest()): PageResponse<Record> {
        val page = recordService.getRecordPage(recordRequest)
        return PageResponse.fromPage(page)
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

data class RecordRequest(
    // page & sort
    val page: Int = 0,
    val size: Int = 10,
    val sortDirection: SortDirection = SortDirection.DESC,
    val sortKey: String = "timestamp",

    // filters
    val topic: String? = null
) {
    enum class SortDirection {
        ASC, DESC
    }

    private fun toSort(): Sort {
        return when (sortDirection) {
            SortDirection.ASC -> Sort.by(sortKey).ascending()
            SortDirection.DESC -> Sort.by(sortKey).descending()
        }
    }

    fun toPage() = PageRequest.of(page, size, this.toSort())
}