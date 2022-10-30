package com.mnijdam.kafkatriage.configuration

import org.apache.kafka.clients.admin.AdminClient
import org.apache.kafka.clients.producer.KafkaProducer
import org.springframework.boot.autoconfigure.kafka.KafkaProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class KafkaConfig(
    val kafkaProperties: KafkaProperties
) {

    @Bean
    fun adminClient(): AdminClient {
        return AdminClient.create(kafkaProperties.buildAdminProperties())
    }

    @Bean
    fun kafkaProducer(): KafkaProducer<String, ByteArray> {
        val configs = kafkaProperties.buildProducerProperties()

        return KafkaProducer(configs)
    }
}
