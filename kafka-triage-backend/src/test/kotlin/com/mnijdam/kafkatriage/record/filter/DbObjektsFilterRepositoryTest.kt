package com.mnijdam.kafkatriage.record.filter

import com.mnijdam.kafkatriage.record.RecordFilter
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.domain.Pageable
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("local")
class DbObjektsFilterRepositoryTest(@Autowired private val repo: DbObjektsFilterRepository) {

    @Test
    fun `when retrieving record page without filters, then finds all 3 records in the database`() {
        val recordPage = repo.getRecordPage(listOf(), Pageable.ofSize(10))

        assertEquals(3, recordPage.content.size)
        val record = recordPage.content[0]
        assertEquals("topic1", record.topic)
        assertEquals(1, record.partition)
    }

    @Test
    fun `when retrieving records with topic filter, then finds only records with that topic`() {
        val recordPage = repo.getRecordPage(
            listOf(RecordFilter("topic", RecordFilter.FilterOperation.EQUALS, "topic2")),
            Pageable.ofSize(10)
        )

        assertEquals(1, recordPage.content.size)
        val record = recordPage.content[0]
        assertEquals("topic2", record.topic)
    }
}