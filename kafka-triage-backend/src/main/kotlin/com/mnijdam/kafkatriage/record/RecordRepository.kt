package com.mnijdam.kafkatriage.record

import com.mnijdam.kafkatriage.topic.Topic
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.transaction.annotation.Transactional

interface RecordRepository : JpaRepository<Record, Long> {
    @Query("select new com.mnijdam.kafkatriage.topic.Topic(r.topic, count(*)) from Record r where triaged=false group by r.topic")
    fun listTopics(): List<Topic>

    @Modifying
    @Transactional
    @Query("update Record set triaged=true where id in :ids")
    fun markTriaged(ids: List<Long>)

    @Query("select r from Record r where triaged=false and id in :ids")
    fun findAllByIdUntriaged(ids: List<Long>): List<Record>

    @Modifying
    @Transactional
    @Query("update Record set replayedOffset=:replayedOffset where id=:id")
    fun setReplayedOffset(id: Long, replayedOffset: Long)

    @Query("select r from Record r where topic=:topic")
    fun findByTopic(topic: String, pageable: Pageable): Page<Record>
}