package com.mnijdam.kafkatriage.record

import com.mnijdam.kafkatriage.topic.Topic
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface RecordRepository: JpaRepository<Record, Long> {
    @Query("select new com.mnijdam.kafkatriage.topic.Topic(r.topic, count(*)) from Record r where triaged=false group by r.topic")
    fun listTopics(): List<Topic>
}