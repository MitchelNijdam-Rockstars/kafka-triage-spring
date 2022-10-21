package com.mnijdam.kafkatriage

import com.mnijdam.kafkatriage.record.RecordRepository
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping

@SpringBootApplication
class KafkaTriageApplication(val recordRepository: RecordRepository) {

	@GetMapping("/records")
	fun getRecords() = recordRepository.findAll()
}

fun main(args: Array<String>) {
    runApplication<KafkaTriageApplication>(*args)
}

