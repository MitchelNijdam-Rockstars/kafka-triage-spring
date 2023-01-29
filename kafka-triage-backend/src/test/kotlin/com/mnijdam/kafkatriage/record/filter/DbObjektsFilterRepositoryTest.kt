package com.mnijdam.kafkatriage.record.filter

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("local")
class DbObjektsFilterRepositoryTest(@Autowired private val repo: DbObjektsFilterRepository) {

    @Test
    fun test() {
        val result = repo.test()
        println(result)
    }
}