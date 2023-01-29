package com.mnijdam.kafkatriage.configuration

import com.dbobjekts.api.TransactionManager
import com.mnijdam.kafkatriage.bdobjekts.CatalogDefinition
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.sql.DataSource

@Configuration
class DBObjektsConfig {

    @Bean
    fun dbObjektsTransactionManager(dataSource: DataSource): TransactionManager {
        return TransactionManager.builder()
            .withDataSource(dataSource)
            .withCatalog(CatalogDefinition)
            .build()
    }
}