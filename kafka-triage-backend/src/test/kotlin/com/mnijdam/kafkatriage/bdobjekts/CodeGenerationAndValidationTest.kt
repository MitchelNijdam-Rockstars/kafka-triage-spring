package com.mnijdam.kafkatriage.bdobjekts

import com.dbobjekts.codegen.CodeGenerator
import com.mnijdam.kafkatriage.bdobjekts.CodeGenerationAndValidationTest.Database.createDataSource
import com.zaxxer.hikari.HikariDataSource
import org.junit.jupiter.api.Test
import java.nio.file.Paths
import javax.sql.DataSource

class CodeGenerationAndValidationTest {

    private object Database {
        fun createDataSource(): DataSource {
            val dataSource = HikariDataSource()
            dataSource.jdbcUrl = "jdbc:postgresql://localhost:5432/kafka-triage"
            dataSource.username = "rootuser"
            dataSource.password = "rootpass"
            return dataSource
        }
    }

    @Test
    fun validate() {
        val generator = CodeGenerator().withDataSource(createDataSource())
        generator.configureObjectNaming()
            .setFieldNameForColumn(schema = "public", table = "header", column = "native", fieldName = "nativeHeader")

        generator.configureOutput()
            .basePackageForSources("com.mnijdam.kafkatriage.bdobjekts")
            .outputDirectoryForGeneratedSources(Paths.get("src/main/kotlin/generated").toAbsolutePath().toString())

        generator.generateSourceFiles()
    }


}