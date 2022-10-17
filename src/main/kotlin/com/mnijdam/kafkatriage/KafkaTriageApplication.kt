package com.mnijdam.kafkatriage

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.annotation.Id
import org.springframework.data.repository.kotlin.CoroutineCrudRepository
import org.springframework.web.bind.annotation.GetMapping

@SpringBootApplication
class KafkaTriageApplication(val recordRepository: RecordRepository) {

	@GetMapping("/records")
	fun getRecords() = recordRepository.findAll()
}

fun main(args: Array<String>) {
    runApplication<KafkaTriageApplication>(*args)
}

interface RecordRepository : CoroutineCrudRepository<Record, String>

data class Record(
	@Id
	val id: String?,
	val topic: String
)