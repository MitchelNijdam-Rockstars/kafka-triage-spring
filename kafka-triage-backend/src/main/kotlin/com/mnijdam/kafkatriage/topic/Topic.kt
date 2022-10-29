package com.mnijdam.kafkatriage.topic

data class Topic(
        val name: String,
        val lag: Long = 0
)